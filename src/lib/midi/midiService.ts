/**
 * MIDI Service
 * Handles WebMIDI.js integration, device discovery, and communication
 */

import { WebMidi, type Input, type Output } from "webmidi";
import { monologueConnectionStrings } from "@julzelements/monologue-midi";
import { midiStore } from "$lib/stores/midiStore";
import { MidiErrorType, type MidiDeviceInfo, type MidiError } from "./types";

class MidiService {
  private input: Input | null = null;
  private output: Output | null = null;
  private isInitialized = false;

  /**
   * Initialize WebMIDI and request permission
   * This MUST be called from a user interaction (button click, etc.)
   */
  async initialize(): Promise<void> {
    try {
      midiStore.setConnectionStatus("connecting");

      // Check if Web MIDI API is supported
      if (!navigator.requestMIDIAccess) {
        const error: MidiError = {
          type: MidiErrorType.NOT_SUPPORTED,
          message: "Your browser doesn't support MIDI. Try Chrome, Edge, or Opera.",
          details: "Web MIDI API is not available",
        };
        midiStore.setSupported(false);
        midiStore.setError(error);
        return;
      }

      midiStore.setSupported(true);

      console.log("Requesting MIDI access...");

      // Request MIDI access with SysEx support
      // This will trigger browser permission dialog if not already granted
      await WebMidi.enable({ sysex: true });

      console.log("MIDI access granted");

      this.isInitialized = true;
      midiStore.setPermission(true);

      // Set up device connection listeners
      this.setupDeviceListeners();

      // Try to find and connect to Monologue
      await this.findAndConnectMonologue();
    } catch (error) {
      console.error("MIDI initialization error:", error);

      let midiError: MidiError;

      if (error instanceof Error) {
        // Check if permission was denied
        if (error.message.includes("denied") || error.message.includes("permission")) {
          midiError = {
            type: MidiErrorType.PERMISSION_DENIED,
            message: "MIDI access denied. Please allow MIDI access in your browser settings.",
            details: error.message,
          };
        } else {
          midiError = {
            type: MidiErrorType.CONNECTION_FAILED,
            message: "Failed to initialize MIDI",
            details: error.message,
          };
        }
      } else {
        midiError = {
          type: MidiErrorType.CONNECTION_FAILED,
          message: "Failed to initialize MIDI",
          details: String(error),
        };
      }

      midiStore.setError(midiError);
      midiStore.setConnectionStatus("error");
    }
  }

  /**
   * Set up listeners for device connection/disconnection
   */
  private setupDeviceListeners(): void {
    WebMidi.addListener("connected", (event) => {
      console.log("MIDI device connected:", event.port.name);

      // Check if it's a Monologue
      if (this.isMonologueDevice(event.port.name)) {
        this.findAndConnectMonologue();
      }
    });

    WebMidi.addListener("disconnected", (event) => {
      console.log("MIDI device disconnected:", event.port.name);

      // Check if our connected device was disconnected
      if (this.input?.id === event.port.id || this.output?.id === event.port.id) {
        this.disconnect();
      }
    });
  }

  /**
   * Check if a device name matches the Monologue
   */
  private isMonologueDevice(name: string): boolean {
    const lowerName = name.toLowerCase();
    return lowerName.includes("monologue");
  }

  /**
   * Find and connect to the Korg Monologue
   */
  async findAndConnectMonologue(): Promise<void> {
    try {
      if (!this.isInitialized) {
        console.warn("MIDI not initialized yet");
        return;
      }

      // Look for exact matches first
      let input = WebMidi.getInputByName(monologueConnectionStrings.input);
      let output = WebMidi.getOutputByName(monologueConnectionStrings.output);

      if (input) {
        console.log(input);
        input.addListener("noteon", (event) => {
          console.log(event);
        });
      }

      if (!input || !output) {
        const error: MidiError = {
          type: MidiErrorType.DEVICE_NOT_FOUND,
          message: "Korg Monologue not detected. Ensure it's powered on and connected.",
          details: 'No device matching "monologue" found',
        };
        midiStore.setError(error);
        midiStore.setConnectionStatus("disconnected");
        return;
      }

      // Connect to the device
      this.input = input;
      this.output = output;

      // Update store with device info
      const deviceInfo: MidiDeviceInfo = {
        id: input.id,
        name: input.name,
        manufacturer: input.manufacturer || "Unknown",
      };

      midiStore.setDevice(deviceInfo);
      console.log("Connected to:", deviceInfo.name);
    } catch (error) {
      console.error("Error finding Monologue:", error);
      const midiError: MidiError = {
        type: MidiErrorType.DEVICE_NOT_FOUND,
        message: "Failed to connect to Monologue",
        details: error instanceof Error ? error.message : String(error),
      };
      midiStore.setError(midiError);
    }
  }

  /**
   * Disconnect from current device
   */
  disconnect(): void {
    if (this.input) {
      this.input.removeListener();
      this.input = null;
    }

    if (this.output) {
      this.output = null;
    }

    midiStore.disconnect();
    console.log("Disconnected from MIDI device");
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.input !== null && this.output !== null;
  }

  /**
   * Check if MIDI is initialized
   */
  getInitialized(): boolean {
    return this.isInitialized;
  }
}

/**
 * Global MIDI service instance
 */
export const midiService = new MidiService();
