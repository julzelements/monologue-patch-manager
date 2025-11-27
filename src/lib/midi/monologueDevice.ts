/**
 * Monologue Device Handler
 * Handles Monologue-specific MIDI communication using @julzelements/monologue-midi
 */

import { CC_TO_PARAMETER } from "@julzelements/monologue-midi";

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
    input.addListener("controlchange", (event: any) => {
      const ccNumber = event.controller.number;
      const value = event.value;

      // Decode CC using monologue-midi
      const parameterId = CC_TO_PARAMETER[ccNumber];

      const eventData = {
        ccNumber,
        value,
        parameterId: parameterId || "unknown",
      };

      if (parameterId) {
        console.log("🎛️ CC:", ccNumber, "→", parameterId, "value:", value);
      } else {
        console.log("🎛️ CC:", ccNumber, "value:", value, "(unknown parameter)");
      }

      // Dispatch custom event for UI
      window.dispatchEvent(new CustomEvent("midi:cc", { detail: eventData }));
    });
  }
}

/**
 * Global Monologue device instance
 */
export const monologueDevice = new MonologueDevice();
