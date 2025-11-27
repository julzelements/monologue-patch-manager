<script lang="ts">
  /**
   * MIDI Event Monitor Component
   * Displays incoming MIDI events in real-time
   */

  import { onMount } from "svelte";
  import type { MonologueControlChangeDetail } from "$lib/midi/types";

  type MidiEventType = "noteon" | "controlchange";

  interface NoteOnDetail {
    name: string;
    number: number;
    velocity: number;
  }

  type MidiEventData = NoteOnDetail | MonologueControlChangeDetail;

  interface MidiUiEvent {
    id: number;
    type: MidiEventType;
    timestamp: Date;
    data: MidiEventData;
  }

  let events: MidiUiEvent[] = $state([]);
  let eventIdCounter = 0;
  const MAX_EVENTS = 50; // Keep only the last 50 events

  function addEvent(type: MidiEventType, data: MidiEventData) {
    const newEvent: MidiUiEvent = {
      id: eventIdCounter++,
      type,
      timestamp: new Date(),
      data,
    };

    events = [newEvent, ...events].slice(0, MAX_EVENTS);
  }

  onMount(() => {
    const handleNoteOn = (e: CustomEvent<NoteOnDetail>) => {
      addEvent("noteon", e.detail);
    };

    const handleCC = (e: CustomEvent<MonologueControlChangeDetail>) => {
      addEvent("controlchange", e.detail);
    };

    window.addEventListener("midi:noteon" as any, handleNoteOn);
    window.addEventListener("midi:parameter" as any, handleCC);

    return () => {
      window.removeEventListener("midi:noteon" as any, handleNoteOn);
      window.removeEventListener("midi:parameter" as any, handleCC);
    };
  });

  function clearEvents() {
    events = [];
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  }
</script>

<div class="midi-event-monitor">
  <div class="monitor-header">
    <h3>MIDI Events</h3>
    <button class="btn-clear" onclick={clearEvents}>Clear</button>
  </div>

  <div class="event-list">
    {#if events.length === 0}
      <div class="no-events">No events yet. Play notes or turn knobs on your Monologue.</div>
    {:else}
      {#each events as event (event.id)}
        <div class="event-item" class:note={event.type === "noteon"} class:cc={event.type === "controlchange"}>
          <span class="event-time">{formatTime(event.timestamp)}</span>
          {#if event.type === "noteon"}
            <span class="event-icon">🎹</span>
            <span class="event-data">
              {(event.data as NoteOnDetail).name} ({(event.data as NoteOnDetail).number}) vel: {(
                event.data as NoteOnDetail
              ).velocity}
            </span>
          {:else}
            <span class="event-icon">🎛️</span>
            <span class="event-data">
              CC {(event.data as MonologueControlChangeDetail).midiValue} → {(
                event.data as MonologueControlChangeDetail
              ).parameterId} = {(event.data as MonologueControlChangeDetail).normalisedValue.toFixed(5)}
            </span>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .midi-event-monitor {
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    /* visually constrain size */
    min-height: 180px;
    max-height: 220px;
  }

  .monitor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-clear {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .btn-clear:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .event-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse; /* newest at top; flip to column if you prefer bottom */
    gap: 0.4rem;
  }

  .no-events {
    text-align: center;
    padding: 1.5rem;
    opacity: 0.6;
    font-size: 0.85rem;
  }

  .event-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    font-size: 0.8rem;
    font-family: "Courier New", monospace;
  }

  .event-item.note {
    border-left: 3px solid #00ff00;
  }

  .event-item.cc {
    border-left: 3px solid #00aaff;
  }

  .event-time {
    color: #888;
    min-width: 90px;
  }

  .event-icon {
    font-size: 0.95rem;
  }

  .event-data {
    flex: 1;
    color: #fff;
  }

  /* subtle scrollbar to show overflow */
  .event-list::-webkit-scrollbar {
    width: 6px;
  }

  .event-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .event-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .event-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
