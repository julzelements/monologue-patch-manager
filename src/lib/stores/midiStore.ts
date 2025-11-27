/**
 * Svelte store for MIDI connection state
 */

import { writable } from "svelte/store";
import type { MidiState, MidiDeviceInfo, ConnectionStatus, MidiError } from "$lib/midi/types";

/**
 * Check if browser supports Web MIDI API
 */
function checkMidiSupport(): boolean {
  return typeof navigator !== "undefined" && "requestMIDIAccess" in navigator;
}

/**
 * Initial MIDI state
 */
const initialState: MidiState = {
  isSupported: checkMidiSupport(),
  hasPermission: false,
  connectionStatus: "disconnected",
  device: null,
  error: null,
  lastSyncTime: null,
};

/**
 * Create the MIDI store
 */
function createMidiStore() {
  const { subscribe, set, update } = writable<MidiState>(initialState);

  return {
    subscribe,

    /**
     * Set whether Web MIDI API is supported
     */
    setSupported: (isSupported: boolean) => {
      update((state) => ({ ...state, isSupported }));
    },

    /**
     * Set permission status
     */
    setPermission: (hasPermission: boolean) => {
      update((state) => ({ ...state, hasPermission }));
    },

    /**
     * Set connection status
     */
    setConnectionStatus: (status: ConnectionStatus) => {
      update((state) => ({ ...state, connectionStatus: status }));
    },

    /**
     * Set connected device
     */
    setDevice: (device: MidiDeviceInfo | null) => {
      update((state) => ({
        ...state,
        device,
        connectionStatus: device ? "connected" : "disconnected",
        error: device ? null : state.error,
      }));
    },

    /**
     * Set error state
     */
    setError: (error: MidiError | null) => {
      update((state) => ({
        ...state,
        error: error?.message || null,
        connectionStatus: error ? "error" : state.connectionStatus,
      }));
    },

    /**
     * Update last sync time
     */
    updateSyncTime: () => {
      update((state) => ({ ...state, lastSyncTime: new Date() }));
    },

    /**
     * Reset to initial state
     */
    reset: () => {
      set(initialState);
    },

    /**
     * Disconnect and clear device
     */
    disconnect: () => {
      update((state) => ({
        ...state,
        connectionStatus: "disconnected",
        device: null,
        error: null,
      }));
    },
  };
}

/**
 * Global MIDI store instance
 */
export const midiStore = createMidiStore();
