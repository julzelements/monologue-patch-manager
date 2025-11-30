import { synthStore } from "$lib/stores";
import type { MonologueControlChangeDetail } from "$lib/midi/types";

// Central bridge: map midi:parameter events into synthStore updates.
if (typeof window !== "undefined") {
  window.addEventListener("midi:parameter", ((event: CustomEvent<MonologueControlChangeDetail>) => {
    const { parameterId, normalisedValue } = event.detail;

    const value0To1023 = Math.round(normalisedValue * 1023);

    switch (parameterId) {
      case "masterLevel":
        synthStore.setMasterLevel(value0To1023);
        break;
      case "vco1Shape":
        synthStore.setVco1Shape(value0To1023);
        break;
      case "vco1Level":
        synthStore.setVco1Level(value0To1023);
        break;
      case "vco1Wave": {
        // 0..1 -> 0..2, inverted as in Vco1 component
        const index = 2 - Math.round(normalisedValue * 2);
        synthStore.setVco1Wave(index);
        break;
      }
      case "vco2Pitch":
        synthStore.setVco2Pitch(value0To1023);
        break;
      case "vco2Shape":
        synthStore.setVco2Shape(value0To1023);
        break;
      case "vco2Level":
        synthStore.setVco2Level(value0To1023);
        break;
      case "vco2Wave": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setVco2Wave(index);
        break;
      }
      case "vco2Octave": {
        const index = 3 - Math.round(normalisedValue * 3); // 0..3, inverted
        synthStore.setVco2Octave(index);
        break;
      }
      case "syncRing": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setSyncRing(index);
        break;
      }
      case "filterCutoff":
        synthStore.setFilterCutoff(value0To1023);
        break;
      case "filterResonance":
        synthStore.setFilterResonance(value0To1023);
        break;
      case "envelopeAttack":
        synthStore.setEnvelopeAttack(value0To1023);
        break;
      case "envelopeDecay":
        synthStore.setEnvelopeDecay(value0To1023);
        break;
      case "envelopeIntensity":
        synthStore.setEnvelopeIntensity(value0To1023);
        break;
      case "envelopeType": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setEnvelopeType(index);
        break;
      }
      case "envelopeTarget": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setEnvelopeTarget(index);
        break;
      }
      case "drive":
        synthStore.setDrive(value0To1023);
        break;
      case "keyboardOctave": {
        // keyboard octave is an index into LABELS.KEYBOARD_OCTAVE_LABELS
        const index = Math.round(normalisedValue * 4); // 0..4
        synthStore.setKeyboardOctave(index);
        break;
      }
      case "sequencerMode": {
        // 3 modes: NOTE, SLIDE, MOTION
        const index = Math.round(normalisedValue * 2); // 0..2
        synthStore.setSequencerMode(index);
        break;
      }
      default:
        // Other parameters can be handled here later
        break;
    }
  }) as EventListener);
}
