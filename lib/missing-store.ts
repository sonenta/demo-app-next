import type { MissingKeyEvent } from "@sonenta/react-i18next";

export type MissingKeyEntry = MissingKeyEvent & { _receivedAt: number };

type Listener = () => void;

type State = {
  events: MissingKeyEntry[];
  flushed: number;
  lastBatchAt: number | null;
};

let state: State = { events: [], flushed: 0, lastBatchAt: null };
const listeners = new Set<Listener>();

const emit = () => {
  for (const l of listeners) l();
};

/**
 * Tiny external store the client provider's missing-key transport feeds. Keeps
 * the telemetry out of React state so reporting never re-renders the provider.
 */
export const missingStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): State {
    return state;
  },
  getServerSnapshot(): State {
    return state;
  },
  pushBatch(batch: MissingKeyEvent[]) {
    const now = Date.now();
    const stamped: MissingKeyEntry[] = batch.map((ev) => ({
      ...ev,
      _receivedAt: now,
    }));
    state = {
      events: [...stamped, ...state.events].slice(0, 50),
      flushed: state.flushed + stamped.length,
      lastBatchAt: now,
    };
    emit();
  },
  clear() {
    state = { events: [], flushed: 0, lastBatchAt: null };
    emit();
  },
};
