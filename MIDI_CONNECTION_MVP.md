# MIDI Connection Feature - MVP Plan

## Overview

This document outlines the MVP (Minimum Viable Product) for implementing MIDI connectivity between the web-based Monologue Patch Manager and a physical Korg Monologue synthesizer.

## Technology Stack

### Core Libraries

- **WebMIDI.js** (v3.x) - Browser MIDI API wrapper for device discovery and communication

### Integration Benefits

- WebMIDI.js handles the browser MIDI API complexity and device management

---

## MVP Features

### 1. Device Discovery & Connection

**Goal:** Detect and connect to the Korg Monologue when available

**Features:**

- Auto-detect Korg Monologue when connected via USB
- Display connection status (disconnected, connecting, connected, error)
- Handle device connection/disconnection events
- Show device name and manufacturer info
- Manual reconnect button

**User Stories:**

- As a user, I want to see when my Monologue is connected
- As a user, I want to be notified if my Monologue disconnects
- As a user, I want to manually trigger a reconnection attempt

---

### 4. Connection UI Component

**Goal:** Dedicated UI for MIDI connection management

**Features:**

- Connection status indicator (LED/badge)
- Device info display
- Connect/Disconnect button
- Error messages with troubleshooting tips
- Browser compatibility warning (if Web MIDI API not supported)

**User Stories:**

- As a user, I want clear visual feedback about my connection status
- As a user, I want helpful error messages if something goes wrong

---

## Technical Architecture

### Component Structure

```
src/lib/
├── midi/
│   ├── MidiConnectionManager.svelte  # Main UI component
│   ├── midiService.ts                # WebMIDI.js integration
│   ├── monologueDevice.ts            # Device-specific logic
│   └── types.ts                      # TypeScript interfaces
└── stores/
    └── midiStore.ts                  # Svelte store for MIDI state
```

### State Management

Use Svelte stores for reactive MIDI state:

```typescript
// midiStore.ts
interface MidiState {
  isSupported: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  device: MonologueDevice | null;
  error: string | null;
  lastSyncTime: Date | null;
}
```

### Key Classes/Services

#### 1. MidiService (midiService.ts)

Responsibilities:

- Initialize WebMIDI.js
- Scan for MIDI devices
- Handle connection/disconnection events
- Send/receive raw MIDI messages

```typescript
class MidiService {
  async initialize(): Promise<void>;
  async findMonologue(): Promise<Input | null>;
  async connectToDevice(input: Input, output: Output): Promise<void>;
  disconnect(): void;
  sendSysEx(data: Uint8Array): Promise<void>;
  sendCC(ccNumber: number, value: number, channel?: number): void;
  onSysEx(callback: (data: Uint8Array) => void): void;
  onCC(callback: (ccNumber: number, value: number) => void): void;
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Basic WebMIDI.js integration

- [ ] Install webmidi package
- [ ] Create midiService.ts with basic WebMIDI initialization
- [ ] Create midiStore.ts for state management
- [ ] Detect if Web MIDI API is supported
- [ ] Scan and list all available MIDI devices
- [ ] Filter for Korg Monologue (by name/manufacturer)

**Success Criteria:**

- Can detect when Monologue is connected
- Console logs device connection events

---

### Phase 2: UI Component (Week 2-3)

**Goal:** User-friendly connection interface

- [ ] Create MidiConnectionManager.svelte component
- [ ] Add connection status indicator to main UI
- [ ] Display device info when connected
- [ ] Add manual connect/disconnect buttons
- [ ] Show error messages with helpful text
- [ ] Add browser compatibility check

**Success Criteria:**

- Clear visual feedback of connection status
- Users can manually trigger connection
- Helpful error messages for common issues

---

## File Changes Required

### New Files

```
src/lib/midi/
  midiService.ts           # WebMIDI.js wrapper
  types.ts                 # TypeScript interfaces
  MidiConnectionManager.svelte  # UI component

src/lib/stores/
  midiStore.ts             # MIDI state management
```

### Modified Files

```
package.json
  - Add webmidi dependency
```

---

## Data Flow

### Device Connection Flow

```
User connects Monologue
  ↓
WebMIDI API fires 'connected' event
  ↓
MidiService detects device
  ↓
Filters for "monologue" in device name
  ↓
Updates midiStore with connection status
  ↓
UI shows "Connected" status
```

### Patch Load Flow (Hardware → UI)

```
User clicks "Load from Hardware"
  ↓
MonologueDevice.requestCurrentProgram()
  ↓
Send SysEx program dump request
  ↓
Hardware responds with SysEx data
  ↓
MidiService receives SysEx message
  ↓
decodeMonologueParameters(sysexData)
  ↓
Update app state with decoded parameters
  ↓
UI re-renders with hardware values
```

---

## Error Handling

### Connection Errors

- **Browser doesn't support Web MIDI API**
  - Show message: "Your browser doesn't support MIDI. Try Chrome, Edge, or Opera."
- **No MIDI devices found**
  - Show message: "No MIDI devices detected. Check USB connection."
- **Monologue not found**
  - Show message: "Korg Monologue not detected. Ensure it's powered on and connected."
- **Permission denied**
  - Show message: "MIDI access denied. Please allow MIDI access in your browser settings."

## Testing Strategy

### Manual Testing

1. **Connection Tests**
   - Connect/disconnect Monologue during app usage
   - Connect multiple MIDI devices
   - Start app with Monologue already connected
   - Connect Monologue after app starts

2. **Error Scenarios**
   - Browser without MIDI support

### Browser Compatibility

- ✅ Chrome (80+)
- ✅ Edge (80+)
- ✅ Opera (67+)
- ❌ Firefox (no Web MIDI support)
- ❌ Safari (no Web MIDI support)

---

## Dependencies

### Required

```json
{
  "webmidi": "^3.1.14",
  "@julzelements/monologue-midi": "0.1.7"
}
```

### Dev Dependencies

```json
{
  "@types/webmidi": "^2.0.9" // if not included in webmidi package
}
```

---

## Key Considerations

### Performance

- **Throttling:** Limit CC messages to ~30-50 per second to avoid MIDI buffer overflow
- **Debouncing:** Wait 50-100ms after last UI change before sending
- **SysEx Size:** Full program dump is ~500 bytes, takes ~50ms to transfer

### Browser Security

- Web MIDI API requires HTTPS in production
- User must grant MIDI access permission (browser prompt)
- Some browsers block MIDI on insecure contexts

### Device Identification

The `@julzelements/monologue-midi` package exports `monologueConnectionStrings` with the exact device names:

```typescript
import { monologueConnectionStrings } from "@julzelements/monologue-midi";

// monologueConnectionStrings = {
//   input: "monologue KBD/KNOB",
//   output: "monologue SOUND"
// }
```

**Device Names:**

- **Input Port:** `"monologue KBD/KNOB"` - Receives MIDI from computer (keyboard/knob control)
- **Output Port:** `"monologue SOUND"` - Sends MIDI to computer (hardware state, SysEx dumps)

**Matching Strategy:**

- Use exact string matching with `monologueConnectionStrings.input` for output device (computer → hardware)
- Use exact string matching with `monologueConnectionStrings.output` for input device (hardware → computer)
- Note: WebMIDI.js "output" is where we send (input on hardware), "input" is where we receive (output from hardware)
- Fallback: Case-insensitive search for "monologue" if exact match fails (cross-platform compatibility)

### MIDI Channel

- Monologue can be set to any MIDI channel (1-16)
- Default is channel 1
- May need channel selection in UI if user changes hardware settings

---

## Success Metrics

### MVP Complete When:

- ✅ Can detect and connect to Korg Monologue
- ✅ Can request and load current program from hardware
- ✅ Can send parameter changes from UI to hardware
- ✅ Connection status clearly displayed
- ✅ Error messages helpful and actionable
- ✅ Works in Chrome/Edge/Opera on macOS/Windows
- ✅ No MIDI flooding or dropped messages
- ✅ All panel parameters (knobs/toggles) functional

### User Acceptance Criteria:

1. User plugs in Monologue → App shows "Connected"
2. User clicks "Load from Hardware" → UI updates with current patch
3. User turns knob in UI → Hardware parameter changes immediately
4. User unplugs Monologue → App shows "Disconnected" with reconnect option

---

## Resources

### Documentation

- [WebMIDI.js Docs](https://webmidijs.org/docs/)
- [WebMIDI.js API Reference](https://webmidijs.org/api/)
- [@julzelements/monologue-midi GitHub](https://github.com/julzelements/monologue-midi)
- [Web MIDI API Spec](https://www.w3.org/TR/webmidi/)
- [Korg Monologue MIDI Implementation](https://www.korg.com/us/support/download/manual/0/811/4429/) (Official docs)

### Examples

- [WebMIDI.js Examples](https://webmidijs.org/examples/)
- [Web MIDI API Samples](https://webaudio.github.io/web-midi-api/)

---

## Questions to Resolve

1. **MIDI Channel:** Should we support channel selection or default to channel 1?
   - **Recommendation:** Default to channel 1, add setting later if needed
2. **Sync Direction:** Should hardware changes update the UI (if possible)?
   - **MVP:** No (one-way: UI → Hardware only)
   - **Future:** Yes (bidirectional sync)

3. **Persistence:** Should connection preference be saved?
   - Use localStorage to remember device ID

4. **Offline Mode:** Should app work without hardware connected?
   - **Yes:** App should be fully functional without hardware (current behavior)
   - MIDI connection is an optional enhancement

---
