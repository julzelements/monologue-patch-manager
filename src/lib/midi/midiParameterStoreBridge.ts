import { synthStore } from "$lib/stores";
import type { MonologueControlChangeDetail } from "$lib/midi/types";

// Central bridge: map midi:parameter events into synthStore updates.
if (typeof window !== "undefined") {
  window.addEventListener("midi:parameter", ((event: CustomEvent<MonologueControlChangeDetail>) => {
    const { parameterId, normalisedValue } = event.detail;

    const value0To1023 = Math.round(normalisedValue * 1023);

    switch (parameterId) {
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
      default:
        // Other parameters can be handled here later
        break;
    }
  }) as EventListener);
}
