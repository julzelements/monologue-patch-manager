# MIDI Connection Implementation

## Overview

The MIDI connection feature has been successfully implemented, allowing the Monologue Patch Manager to connect to and communicate with a physical Korg Monologue synthesizer via USB MIDI.

## Features Implemented

✅ **Device Discovery & Connection**

- Auto-detect Korg Monologue when connected via USB
- Display connection status (disconnected, connecting, connected, error)
- Handle device connection/disconnection events
- Show device name and manufacturer info
- Manual connect/disconnect controls

✅ **Permission Request**

- User must click "Connect MIDI" button to trigger browser permission dialog
- Clear error messages if permission is denied
- Browser compatibility detection

✅ **Connection UI Component**

- Status indicator with color coding (green=connected, red=error, yellow=connecting, gray=disconnected)
- Device info display when connected
- Error messages with helpful troubleshooting tips
- Load from Hardware button (when connected)

## File Structure

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

## How to Use

1. **Start the Application**

   ```bash
   npm run dev
   ```

2. **Connect Your Monologue**
   - Connect your Korg Monologue to your computer via USB
   - Ensure it is powered on

3. **Establish MIDI Connection**
   - Click the "Connect MIDI" button in the UI
   - Grant MIDI access permission when prompted by the browser
   - The status indicator will turn green when connected
   - Device information will be displayed

4. **Load Current Program**
   - Once connected, click "Load from Hardware"
   - The current program will be requested from the Monologue
   - Parameters will be logged to the console (UI integration pending)

## Browser Compatibility

✅ **Supported:**

- Chrome 80+
- Edge 80+
- Opera 67+

❌ **Not Supported:**

- Firefox (no Web MIDI API support)
- Safari (no Web MIDI API support)

## Technical Details

### MIDI Communication

**Device Names:**

- Input Port: `"monologue SOUND"` (hardware → computer)
- Output Port: `"monologue KBD/KNOB"` (computer → hardware)

**Program Dump Request:**

- SysEx format: `F0 42 30 00 01 49 10 F7`
- Default MIDI channel: 1
- Timeout: 5 seconds

**Libraries Used:**

- `webmidi` (v3.x) - Web MIDI API wrapper
- `@julzelements/monologue-midi` (v0.2.0) - Monologue parameter encoding/decoding

### State Management

The MIDI state is managed through a Svelte store (`midiStore`) with the following properties:

```typescript
interface MidiState {
  isSupported: boolean; // Web MIDI API support
  hasPermission: boolean; // MIDI access granted
  connectionStatus: ConnectionStatus; // Current status
  device: MidiDeviceInfo | null; // Connected device info
  error: string | null; // Error message
  lastSyncTime: Date | null; // Last communication time
}
```

### Error Handling

The system handles several error scenarios:

- Browser doesn't support Web MIDI API
- MIDI access permission denied
- No MIDI devices found
- Monologue not found among available devices
- Connection or communication failures

All errors display user-friendly messages with troubleshooting suggestions.

## Next Steps (Future Enhancements)

- [ ] Integrate loaded parameters with UI knobs/toggles
- [ ] Send parameter changes from UI to hardware
- [ ] Bidirectional sync (hardware changes update UI)
- [ ] Save/load patches to/from hardware
- [ ] MIDI channel selection
- [ ] Batch parameter updates with throttling

## Testing

To test the MIDI functionality:

1. Open the app in a supported browser
2. Open browser console for detailed logs
3. Connect your Monologue
4. Click "Connect MIDI" and grant permission
5. Verify connection status turns green
6. Click "Load from Hardware" and check console for parameter dump

## Security Notes

- Web MIDI API requires HTTPS in production
- User must explicitly grant MIDI access (browser security requirement)
- Permission is remembered per-origin after first grant
