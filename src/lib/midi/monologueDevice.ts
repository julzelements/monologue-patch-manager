/**
 * Monologue Device Handler
 * Handles Monologue-specific MIDI communication using @julzelements/monologue-midi
 */

import { midiService } from "./midiService";

class MonologueDevice {
  /**
   * Set up Monologue-specific event listeners
   */
  setupListeners(input: any): void {
    // Set up note event listener
    input.addListener("noteon", (event: any) => {
      console.log("🎹 Note ON:", event.note.name, event.note.number, "velocity:", event.note.rawAttack);
    });

    // Set up control change listener
    input.addListener("controlchange", (event: any) => {
      console.log("🎛️ CC:", event.controller.number, "value:", event.value, "name:", event.controller.name);
    });
  }
}

/**
 * Global Monologue device instance
 */
export const monologueDevice = new MonologueDevice();
