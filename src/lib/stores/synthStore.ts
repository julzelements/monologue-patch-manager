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

export type EnvelopeState = {
  type: number; // 0–2 index into EG_TYPE_LABELS
  target: number; // 0–2 index into EG_TARGET_LABELS
  attack: number; // 0–1023
  decay: number; // 0–1023
  intensity: number; // 0–1023
};

export type LfoState = {
  rate: number; // 0–1023
  intensity: number; // 0–1023
  mode: number; // 0–2 index into LFO_MODE_LABELS
  wave: number; // 0–2 index into LFO_TYPE_LABELS
  target: number; // 0–2 index into LFO_TARGET_LABELS
};

export type SynthState = {
  global: GlobalState;
  filter: FilterState;
  vco1: Vco1State;
  vco2: Vco2State;
  envelope: EnvelopeState;
  lfo: LfoState;
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
  envelope: {
    type: 0,
    target: 0,
    attack: 0,
    decay: 0,
    intensity: 0,
  },
  lfo: {
    rate: 0,
    intensity: 0,
    mode: 0,
    wave: 0,
    target: 0,
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
    setEnvelopeType(index: number) {
      update((state) => ({
        ...state,
        envelope: {
          ...state.envelope,
          type: index,
        },
      }));
    },
    setEnvelopeTarget(index: number) {
      update((state) => ({
        ...state,
        envelope: {
          ...state.envelope,
          target: index,
        },
      }));
    },
    setEnvelopeAttack(value: number) {
      update((state) => ({
        ...state,
        envelope: {
          ...state.envelope,
          attack: value,
        },
      }));
    },
    setEnvelopeDecay(value: number) {
      update((state) => ({
        ...state,
        envelope: {
          ...state.envelope,
          decay: value,
        },
      }));
    },
    setEnvelopeIntensity(value: number) {
      update((state) => ({
        ...state,
        envelope: {
          ...state.envelope,
          intensity: value,
        },
      }));
    },
    setLfoRate(value: number) {
      update((state) => ({
        ...state,
        lfo: {
          ...state.lfo,
          rate: value,
        },
      }));
    },
    setLfoIntensity(value: number) {
      update((state) => ({
        ...state,
        lfo: {
          ...state.lfo,
          intensity: value,
        },
      }));
    },
    setLfoMode(index: number) {
      update((state) => ({
        ...state,
        lfo: {
          ...state.lfo,
          mode: index,
        },
      }));
    },
    setLfoWave(index: number) {
      update((state) => ({
        ...state,
        lfo: {
          ...state.lfo,
          wave: index,
        },
      }));
    },
    setLfoTarget(index: number) {
      update((state) => ({
        ...state,
        lfo: {
          ...state.lfo,
          target: index,
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
export const envelopeStore = derived(synthStore, ($synth) => $synth.envelope);
export const lfoStore = derived(synthStore, ($synth) => $synth.lfo);
