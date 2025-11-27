/**
 * Monologue Device Handler
 * Handles Monologue-specific MIDI communication using @julzelements/monologue-midi
 */

import { CC_TO_PARAMETER } from "@julzelements/monologue-midi";
import type { MonologueCCEvent, MonologueControlChangeDetail } from "$lib/midi/types";
import type { ControlChangeMessageEvent } from "webmidi";

class MonologueDevice {
  /**
   * Set up Monologue-specific event listeners
   */
  setupListeners(input: any): void {
    // Set up note event listener
    input.addListener("noteon", (event: any) => {
      const eventData = {
        name: event.note.name,
        number: event.note.number,
        velocity: event.note.rawAttack,
      };

      console.log("🎹 Note ON:", eventData.name, eventData.number, "velocity:", eventData.velocity);

      // Dispatch custom event for UI
      window.dispatchEvent(new CustomEvent("midi:noteon", { detail: eventData }));
    });

    // Set up control change listener
    input.addListener("controlchange", (event: ControlChangeMessageEvent) => {
      const ccNumber = event.controller.number;
      const normalisedValue = event?.value as number;
      const midiValue = event.dataBytes[1];

      // Decode CC using monologue-midi
      const parameterId = CC_TO_PARAMETER[ccNumber];

      // Allow 0 values; only require that we have a known parameterId
      if (parameterId !== undefined) {
        window.dispatchEvent(
          new CustomEvent<MonologueControlChangeDetail>("midi:parameter", {
            detail: {
              parameterId,
              normalisedValue,
              midiValue,
            },
          }) as MonologueCCEvent
        );
      } else {
        console.log("🎛️ CC:", ccNumber, "value:", midiValue, "(unknown parameter)");
      }
    });
  }
}

/**
 * Global Monologue device instance
 */
export const monologueDevice = new MonologueDevice();
