import { writable, derived, type Writable } from "svelte/store";

export type FilterState = {
  cutoff: number; // 0–1023
  resonance: number; // 0–1023
};

export type SynthState = {
  filter: FilterState;
};

const initialSynthState: SynthState = {
  filter: {
    cutoff: 512,
    resonance: 0,
  },
};

function createSynthStore() {
  const { subscribe, update, set }: Writable<SynthState> = writable(initialSynthState);

  return {
    subscribe,
    setFilterCutoff(value: number) {
      update((state) => ({
        ...state,
        filter: {
          ...state.filter,
          cutoff: value,
        },
      }));
    },
    setFilterResonance(value: number) {
      update((state) => ({
        ...state,
        filter: {
          ...state.filter,
          resonance: value,
        },
      }));
    },
    reset() {
      set(initialSynthState);
    },
  };
}

export const synthStore = createSynthStore();

export const filterStore = derived(synthStore, ($synth) => $synth.filter);
