import { synthStore } from "$lib/stores";
import type { MonologueControlChangeDetail } from "$lib/midi/types";
import { LABELS } from "@julzelements/monologue-midi";

// Central bridge: map midi:parameter events into synthStore updates.
if (typeof window !== "undefined") {
  window.addEventListener("midi:parameter", ((event: CustomEvent<MonologueControlChangeDetail>) => {
    const { parameterId, normalisedValue } = event.detail;

    const value0To1023 = Math.round(normalisedValue * 1023);

    function updateLcd(name: string, value: number | string) {
      window.dispatchEvent(
        new CustomEvent("ui:lcd-parameter", {
          detail: { name, value },
        })
      );
    }

    switch (parameterId) {
      case "masterLevel":
        synthStore.setMasterLevel(value0To1023);
        updateLcd("masterLevel", value0To1023);
        break;
      case "vco1Shape":
        synthStore.setVco1Shape(value0To1023);
        updateLcd("vco1Shape", value0To1023);
        break;
      case "vco1Level":
        synthStore.setVco1Level(value0To1023);
        updateLcd("vco1Level", value0To1023);
        break;
      case "vco1Wave": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..1 -> 0..2, inverted
        synthStore.setVco1Wave(index);
        {
          const labels = [...LABELS.VCO1_WAVE_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("vco1Wave", label);
        }
        break;
      }
      case "vco2Pitch":
        synthStore.setVco2Pitch(value0To1023);
        updateLcd("vco2Pitch", value0To1023);
        break;
      case "vco2Shape":
        synthStore.setVco2Shape(value0To1023);
        updateLcd("vco2Shape", value0To1023);
        break;
      case "vco2Level":
        synthStore.setVco2Level(value0To1023);
        updateLcd("vco2Level", value0To1023);
        break;
      case "vco2Wave": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setVco2Wave(index);
        {
          const labels = [...LABELS.VCO2_WAVE_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("vco2Wave", label);
        }
        break;
      }
      case "vco2Octave": {
        const index = 3 - Math.round(normalisedValue * 3); // 0..3, inverted
        synthStore.setVco2Octave(index);
        {
          const labels = [...LABELS.OCTAVE_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("vco2Octave", label);
        }
        break;
      }
      case "syncRing": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setSyncRing(index);
        {
          const labels = [...LABELS.SYNC_RING_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("syncRing", label);
        }
        break;
      }
      case "filterCutoff":
        synthStore.setFilterCutoff(value0To1023);
        updateLcd("filterCutoff", value0To1023);
        break;
      case "filterResonance":
        synthStore.setFilterResonance(value0To1023);
        updateLcd("filterResonance", value0To1023);
        break;
      case "envelopeAttack":
        synthStore.setEnvelopeAttack(value0To1023);
        updateLcd("envelopeAttack", value0To1023);
        break;
      case "envelopeDecay":
        synthStore.setEnvelopeDecay(value0To1023);
        updateLcd("envelopeDecay", value0To1023);
        break;
      case "envelopeIntensity":
        synthStore.setEnvelopeIntensity(value0To1023);
        updateLcd("envelopeIntensity", value0To1023);
        break;
      case "envelopeType": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setEnvelopeType(index);
        {
          const labels = [...LABELS.EG_TYPE_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("envelopeType", label);
        }
        break;
      }
      case "envelopeTarget": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setEnvelopeTarget(index);
        {
          const labels = [...LABELS.EG_TARGET_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("envelopeTarget", label);
        }
        break;
      }
      case "lfoRate":
        synthStore.setLfoRate(value0To1023);
        updateLcd("lfoRate", value0To1023);
        break;
      case "lfoIntensity":
        synthStore.setLfoIntensity(value0To1023);
        updateLcd("lfoIntensity", value0To1023);
        break;
      case "lfoMode": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setLfoMode(index);
        {
          const labels = [...LABELS.LFO_MODE_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("lfoMode", label);
        }
        break;
      }
      case "lfoType": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setLfoWave(index);
        {
          const labels = [...LABELS.LFO_TYPE_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("lfoType", label);
        }
        break;
      }
      case "lfoTarget": {
        const index = 2 - Math.round(normalisedValue * 2); // 0..2, inverted
        synthStore.setLfoTarget(index);
        {
          const labels = [...LABELS.LFO_TARGET_LABELS].reverse() as string[];
          const label = labels[index] ?? String(index);
          updateLcd("lfoTarget", label);
        }
        break;
      }
      case "sequencerTempo": {
        // Tempo is 0–240 BPM; assume normalisedValue is 0–1
        const tempo = Math.round(normalisedValue * 240);
        synthStore.setSequencerTempo(tempo);
        updateLcd("sequencerTempo", tempo);
        break;
      }
      case "drive":
        synthStore.setDrive(value0To1023);
        updateLcd("drive", value0To1023);
        break;
      case "keyboardOctave": {
        // keyboard octave is an index into LABELS.KEYBOARD_OCTAVE_LABELS
        const index = Math.round(normalisedValue * 4); // 0..4
        synthStore.setKeyboardOctave(index);
        {
          const labels = [...LABELS.KEYBOARD_OCTAVE_LABELS] as string[];
          const label = labels[index] ?? String(index);
          updateLcd("keyboardOctave", label);
        }
        break;
      }
      case "sequencerMode": {
        // 3 modes: NOTE, SLIDE, MOTION
        const index = Math.round(normalisedValue * 2); // 0..2
        synthStore.setSequencerMode(index);
        const seqModeLabels = ["NOTE", "SLIDE", "MOTION"] as const;
        const label = seqModeLabels[index] ?? String(index);
        updateLcd("sequencerMode", label);
        break;
      }
      default:
        // Other parameters can be handled here later
        break;
    }
  }) as EventListener);
}
