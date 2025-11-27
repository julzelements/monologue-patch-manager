/**
 * MIDI connection state types
 */

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

/**
 * Information about the connected MIDI device
 */
export interface MidiDeviceInfo {
  id: string;
  name: string;
  manufacturer: string;
}

/**
 * Global MIDI state
 */
export interface MidiState {
  isSupported: boolean;
  hasPermission: boolean;
  connectionStatus: ConnectionStatus;
  device: MidiDeviceInfo | null;
  error: string | null;
  lastSyncTime: Date | null;
}

/**
 * MIDI error types
 */
export enum MidiErrorType {
  NOT_SUPPORTED = "NOT_SUPPORTED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  DEVICE_NOT_FOUND = "DEVICE_NOT_FOUND",
  CONNECTION_FAILED = "CONNECTION_FAILED",
  COMMUNICATION_ERROR = "COMMUNICATION_ERROR",
}

/**
 * MIDI error with specific type and user-friendly message
 */
export interface MidiError {
  type: MidiErrorType;
  message: string;
  details?: string;
}

/**
 * Custom event detail for parameter changes dispatched from monologueDevice
 */
export interface MonologueParameterChangeDetail {
  parameterId: string;
  normalisedValue: number;
  midiValue: number;
}

export type MonologueParameterChangeEvent = CustomEvent<MonologueParameterChangeDetail>;
