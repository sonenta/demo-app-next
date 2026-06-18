#!/usr/bin/env bash
# deploy.sh — build the Next.js demo as a STATIC EXPORT and rsync out/ to the
# sonenta box.
#
# Native deploy pattern (parité avec demo-app/-vue/-svelte/scripts/deploy.sh):
#   Box   : sonenta@sonenta-web
#   Root  : /data/clients/sonenta/sonenta.com/demos/next
#   Layout: FLAT DOCROOT (case B) — nginx vhost sonenta.com has a location block
#           `/demos/next/` serving the static export with try_files
#           $uri $uri/ $uri.html (multi-page static, wired by website/infra).
#           We rsync out/ straight into $DEPLOY_ROOT with --delete; the website
#           excludes /demos/next/ from its own --delete so there is no conflict.
#
# `next build` with `output: 'export'` (next.config.ts) writes the fully static
# site to out/. No Node process runs on the box. There is no backend key baked
# in — only NEXT_PUBLIC_* / build-time vars are inlined.
#
# Usage:
#   ./scripts/deploy.sh                 # build + rsync to flat docroot
#   ./scripts/deploy.sh --pull          # if HEAD is behind origin/main, ff-only pull
#   ./scripts/deploy.sh --force-dirty   # deploy even with uncommitted changes (warn)
#   ./scripts/deploy.sh --dry-run       # show what would happen, do nothing
#
# Optional env (sane defaults below):
#   DEPLOY_SSH_HOST   (default: sonenta@sonenta-web)
#   DEPLOY_ROOT       (default: /data/clients/sonenta/sonenta.com/demos/next)

set -euo pipefail

# ---- args ----------------------------------------------------------------
DRY_RUN=0
DO_PULL=0
FORCE_DIRTY=0
for arg in "$@"; do
    case "$arg" in
        --dry-run)      DRY_RUN=1 ;;
        --pull)         DO_PULL=1 ;;
        --force-dirty)  FORCE_DIRTY=1 ;;
        -h|--help)
            sed -n '2,30p' "$0"; exit 0 ;;
        *) echo "deploy: unknown arg '$arg'" >&2; exit 2 ;;
    esac
done

run() {
    if [[ $DRY_RUN -eq 1 ]]; then
        echo "+ $*"
    else
        eval "$@"
    fi
}

# ---- locate repo ---------------------------------------------------------
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
cd "$REPO_DIR"

if [[ ! -f package.json ]] || ! grep -q '"@sonenta/demo-app-next"' package.json; then
    echo "deploy: not in demo-app-next repo root (cwd=$REPO_DIR)" >&2
    exit 2
fi

# ---- preflight 1 — SSH reachability --------------------------------------
: "${DEPLOY_SSH_HOST:=sonenta@sonenta-web}"

echo "==> preflight: ssh $DEPLOY_SSH_HOST"
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "$DEPLOY_SSH_HOST" 'true' 2>/dev/null; then
    echo "deploy: SSH $DEPLOY_SSH_HOST injoignable. Vérifie ta clé / l'agent SSH avant de relancer." >&2
    exit 2
fi

# ---- preflight 2 — git state ---------------------------------------------
echo "==> preflight: git"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "deploy: not a git repository" >&2
    exit 2
fi

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$GIT_BRANCH" != "main" ]]; then
    echo "deploy: current branch is '$GIT_BRANCH', expected 'main'." >&2
    echo "        Run \`git switch main\` and try again." >&2
    exit 2
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
    if [[ $FORCE_DIRTY -eq 1 ]]; then
        echo "deploy: WARNING — working tree is DIRTY but --force-dirty was passed." >&2
    else
        echo "deploy: working tree is dirty (uncommitted changes)." >&2
        echo "        Commit/stash them, or re-run with --force-dirty to ignore." >&2
        exit 2
    fi
fi

if ! git fetch --quiet origin main; then
    echo "deploy: \`git fetch origin main\` failed — check your network/origin." >&2
    exit 2
fi

LOCAL_SHA=$(git rev-parse HEAD)
REMOTE_SHA=$(git rev-parse origin/main)
AHEAD=$(git rev-list --count origin/main..HEAD)
BEHIND=$(git rev-list --count HEAD..origin/main)

if [[ "$LOCAL_SHA" == "$REMOTE_SHA" ]]; then
    : # up to date
elif [[ $BEHIND -gt 0 && $AHEAD -eq 0 ]]; then
    if [[ $DO_PULL -eq 1 ]]; then
        echo "    HEAD is $BEHIND commit(s) behind origin/main — pulling (ff-only)…"
        run "git pull --ff-only origin main"
    else
        echo "deploy: HEAD is $BEHIND commit(s) behind origin/main." >&2
        echo "        Run \`git pull origin main\` or re-run with --pull." >&2
        exit 2
    fi
elif [[ $AHEAD -gt 0 && $BEHIND -eq 0 ]]; then
    echo "    HEAD is $AHEAD commit(s) ahead of origin/main — deploying local commits."
else
    echo "    HEAD has diverged from origin/main ($AHEAD ahead, $BEHIND behind) — deploying local HEAD anyway."
fi

GIT_SHA=$(git rev-parse --short=12 HEAD)
echo "    Déploiement depuis commit $GIT_SHA branch main"

# ---- load operator env (gitignored, optional) ----------------------------
ENV_FILE="$REPO_DIR/deploy/.env.production.local"
if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    set -a; . "$ENV_FILE"; set +a
fi

# ---- defaults ------------------------------------------------------------
: "${DEPLOY_ROOT:=/data/clients/sonenta/sonenta.com/demos/next}"

# ---- pick package manager ------------------------------------------------
if [[ -f package-lock.json ]]; then
    INSTALL=(npm ci)
    BUILD=(npm run build)
else
    echo "deploy: no package-lock.json" >&2; exit 2
fi

# ---- build ---------------------------------------------------------------
echo "==> install"
run "${INSTALL[@]}"

echo "==> build static export (sha=$GIT_SHA, branch=$GIT_BRANCH)"
run "${BUILD[@]}"

if [[ ! -d out ]] || [[ ! -f out/index.html ]]; then
    echo "deploy: out/ missing or empty after build (is output:'export' set?)" >&2; exit 1
fi

# Stamp the export with the source commit so `curl /demos/next/version.txt`
# confirms what's actually live.
TS=$(date -u +%Y%m%d-%H%M%SZ)
printf '%s\n%s\n%s\n' "$GIT_SHA" "$GIT_BRANCH" "$TS" > out/version.txt

# ---- push ----------------------------------------------------------------
echo "==> rsync → $DEPLOY_SSH_HOST:$DEPLOY_ROOT/"
run "rsync -avz --delete --human-readable out/ '$DEPLOY_SSH_HOST:$DEPLOY_ROOT/'"

echo
echo "Deployed."
echo "  URL    : https://sonenta.com/demos/next/"
echo "  Commit : $GIT_SHA ($GIT_BRANCH)"
echo "  Target : $DEPLOY_SSH_HOST:$DEPLOY_ROOT"
echo "  Stamp  : $TS (curl https://sonenta.com/demos/next/version.txt to verify)"
