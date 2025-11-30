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

export type Vco1State = {
  shape: number; // 0–1023
  level: number; // 0–1023
  wave: number; // 0–2 index into VCO1_WAVE_LABELS
};

export type Vco2State = {
  pitch: number; // 0–1023
  shape: number; // 0–1023
  level: number; // 0–1023
  wave: number; // 0–2 index into VCO2_WAVE_LABELS
  octave: number; // 0–3 index into OCTAVE_LABELS
  syncRing: number; // 0–2 index into SYNC_RING_LABELS
};

export type SynthState = {
  global: GlobalState;
  filter: FilterState;
  vco1: Vco1State;
  vco2: Vco2State;
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
  vco1: {
    shape: 0,
    level: 0,
    wave: 0,
  },
  vco2: {
    pitch: 0,
    shape: 0,
    level: 0,
    wave: 0,
    octave: 0,
    syncRing: 0,
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
    setVco1Shape(value: number) {
      update((state) => ({
        ...state,
        vco1: {
          ...state.vco1,
          shape: value,
        },
      }));
    },
    setVco1Level(value: number) {
      update((state) => ({
        ...state,
        vco1: {
          ...state.vco1,
          level: value,
        },
      }));
    },
    setVco1Wave(index: number) {
      update((state) => ({
        ...state,
        vco1: {
          ...state.vco1,
          wave: index,
        },
      }));
    },
    setVco2Pitch(value: number) {
      update((state) => ({
        ...state,
        vco2: {
          ...state.vco2,
          pitch: value,
        },
      }));
    },
    setVco2Shape(value: number) {
      update((state) => ({
        ...state,
        vco2: {
          ...state.vco2,
          shape: value,
        },
      }));
    },
    setVco2Level(value: number) {
      update((state) => ({
        ...state,
        vco2: {
          ...state.vco2,
          level: value,
        },
      }));
    },
    setVco2Wave(index: number) {
      update((state) => ({
        ...state,
        vco2: {
          ...state.vco2,
          wave: index,
        },
      }));
    },
    setVco2Octave(index: number) {
      update((state) => ({
        ...state,
        vco2: {
          ...state.vco2,
          octave: index,
        },
      }));
    },
    setSyncRing(index: number) {
      update((state) => ({
        ...state,
        vco2: {
          ...state.vco2,
          syncRing: index,
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
export const vco1Store = derived(synthStore, ($synth) => $synth.vco1);
export const vco2Store = derived(synthStore, ($synth) => $synth.vco2);
