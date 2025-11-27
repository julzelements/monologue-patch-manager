<script lang="ts">
  /**
   * MIDI Connection Manager Component
   * UI for managing MIDI connection to Korg Monologue
   */

  import { midiStore } from "$lib/stores/midiStore";
  import { midiService } from "$lib/midi/midiConnectionService";

  let isConnecting = false;

  /**
   * Handle connect button click - requests MIDI permission
   */
  async function handleConnect() {
    if (isConnecting) return;

    console.log("Connect button clicked - requesting MIDI access");
    isConnecting = true;
    try {
      await midiService.initialize();
      console.log("MIDI initialization complete");
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      isConnecting = false;
    }
  }

  /**
   * Handle disconnect button click
   */
  function handleDisconnect() {
    midiService.disconnect();
  }

  /**
   * Get status color based on connection status
   */
  function getStatusColor(status: typeof $midiStore.connectionStatus): string {
    switch (status) {
      case "connected":
        return "#00ff00";
      case "connecting":
        return "#ffff00";
      case "error":
        return "#ff0000";
      default:
        return "#666666";
    }
  }

  /**
   * Get user-friendly status text
   */
  function getStatusText(status: typeof $midiStore.connectionStatus): string {
    switch (status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "error":
        return "Error";
      default:
        return "Disconnected";
    }
  }
</script>

<div class="midi-connection-manager">
  <div class="connection-status">
    <div
      class="status-indicator"
      style="background-color: {getStatusColor($midiStore.connectionStatus)}"
      class:pulse={$midiStore.connectionStatus === "connecting"}
    ></div>
    <span class="status-text">{getStatusText($midiStore.connectionStatus)}</span>
  </div>

  {#if !$midiStore.isSupported}
    <div class="error-message">
      <strong>MIDI Not Supported</strong>
      <p>Your browser doesn't support MIDI. Try Chrome, Edge, or Opera.</p>
    </div>
  {:else if $midiStore.error}
    <div class="error-message">
      <strong>Connection Error</strong>
      <p>{$midiStore.error}</p>
    </div>
  {/if}

  {#if $midiStore.device}
    <div class="device-info">
      <div class="device-name">{$midiStore.device.name}</div>
      <div class="device-manufacturer">{$midiStore.device.manufacturer}</div>
    </div>
  {/if}

  {#if isConnecting}
    <div class="info-message">
      <p>📋 Please grant MIDI access when prompted by your browser.</p>
    </div>
  {/if}

  <div class="connection-controls">
    {#if $midiStore.connectionStatus === "connected"}
      <button class="btn btn-secondary" onclick={handleDisconnect}> Disconnect </button>
    {:else}
      <button class="btn btn-primary" onclick={handleConnect} disabled={isConnecting || !$midiStore.isSupported}>
        {isConnecting ? "Connecting..." : "Connect MIDI"}
      </button>
    {/if}
  </div>

  {#if $midiStore.lastSyncTime}
    <div class="last-sync">
      Last sync: {$midiStore.lastSyncTime.toLocaleTimeString()}
    </div>
  {/if}
</div>

<style>
  .midi-connection-manager {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
  }

  .status-indicator.pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  .status-text {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .device-info {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  .device-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .device-manufacturer {
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .error-message {
    padding: 0.75rem;
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    border-radius: 4px;
  }

  .error-message strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #ff4444;
  }

  .error-message p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .info-message {
    padding: 0.75rem;
    background: rgba(0, 150, 255, 0.1);
    border: 1px solid rgba(0, 150, 255, 0.3);
    border-radius: 4px;
  }

  .info-message p {
    margin: 0;
    font-size: 0.9rem;
    color: #66b3ff;
  }

  .connection-controls {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #0066cc;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0052a3;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }

  .last-sync {
    font-size: 0.8rem;
    opacity: 0.6;
    text-align: center;
  }
</style>
