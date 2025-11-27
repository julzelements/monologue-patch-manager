<script lang="ts">
  /**
   * MIDI Event Monitor Component
   * Displays incoming MIDI events in real-time
   */

  import { onMount, onDestroy } from "svelte";

  type MidiEventType = "noteon" | "cc";

  interface MidiUiEvent {
    id: number;
    type: MidiEventType;
    timestamp: Date;
    data: any;
  }

  let events: MidiUiEvent[] = $state([]);
  let eventIdCounter = 0;
  const MAX_EVENTS = 50; // Keep only the last 50 events

  function addEvent(type: MidiEventType, data: any) {
    const newEvent: MidiUiEvent = {
      id: eventIdCounter++,
      type,
      timestamp: new Date(),
      data,
    };

    events = [newEvent, ...events].slice(0, MAX_EVENTS);
  }

  // Subscribe to MIDI events
  onMount(() => {
    // Listen for custom events dispatched from monologueDevice
    const handleNoteOn = (e: CustomEvent) => {
      addEvent("noteon", e.detail);
    };

    const handleCC = (e: CustomEvent) => {
      addEvent("cc", e.detail);
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
        <div class="event-item" class:note={event.type === "noteon"} class:cc={event.type === "cc"}>
          <span class="event-time">{formatTime(event.timestamp)}</span>
          {#if event.type === "noteon"}
            <span class="event-icon">🎹</span>
            <span class="event-data">
              {event.data.name} ({event.data.number}) vel: {event.data.velocity}
            </span>
          {:else if event.type === "cc"}
            <span class="event-icon">🎛️</span>
            <span class="event-data">
              CC{event.data.ccNumber} → {event.data.parameterId} = {event.data.value}
            </span>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .midi-event-monitor {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 300px;
    max-height: 300px;
  }

  .monitor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .btn-clear {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-clear:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .event-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  .no-events {
    text-align: center;
    padding: 2rem;
    opacity: 0.5;
    font-size: 0.9rem;
  }

  .event-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    font-size: 0.85rem;
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
    min-width: 100px;
  }

  .event-icon {
    font-size: 1rem;
  }

  .event-data {
    flex: 1;
    color: #fff;
  }

  /* Custom scrollbar */
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
