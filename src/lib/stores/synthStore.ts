import { writable, derived, type Writable } from "svelte/store";

export type FilterState = {
  cutoff: number; // 0–1023
  resonance: number; // 0–1023
};

export type GlobalState = {
  masterLevel: number; // 0–1023
  drive: number; // 0–1023
  keyboardOctave: number; // 0–4 index into KEYBOARD_OCTAVE_LABELS
  sequencerMode: number; // index into seq mode toggle
};

export type SynthState = {
  global: GlobalState;
  filter: FilterState;
};

const initialSynthState: SynthState = {
  global: {
    masterLevel: 0,
    drive: 0,
    keyboardOctave: 0,
    sequencerMode: 0,
  },
  filter: {
    cutoff: 512,
    resonance: 0,
  },
};

function createSynthStore() {
  const { subscribe, update, set }: Writable<SynthState> = writable(initialSynthState);

  return {
    subscribe,
    // Global setters
    setMasterLevel(value: number) {
      update((state) => ({
        ...state,
        global: {
          ...state.global,
          masterLevel: value,
        },
      }));
    },
    setDrive(value: number) {
      update((state) => ({
        ...state,
        global: {
          ...state.global,
          drive: value,
        },
      }));
    },
    setKeyboardOctave(index: number) {
      update((state) => ({
        ...state,
        global: {
          ...state.global,
          keyboardOctave: index,
        },
      }));
    },
    setSequencerMode(index: number) {
      update((state) => ({
        ...state,
        global: {
          ...state.global,
          sequencerMode: index,
        },
      }));
    },
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

export const globalStore = derived(synthStore, ($synth) => $synth.global);
export const filterStore = derived(synthStore, ($synth) => $synth.filter);
