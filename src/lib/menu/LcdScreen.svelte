<script lang="ts">
  export let paramName: string = "";
  export let value: string | number = "";

  const PARAM_DISPLAY_NAMES: Record<string, string> = {
    // Filter
    filterCutoff: "CUTOFF",
    filterResonance: "RESONANCE",
    // VCO1
    vco1Shape: "VCO 1 SHAPE",
    vco1Level: "VCO 1 MIX",
    vco1Wave: "VCO 1 WAVE",
    // VCO2
    vco2Pitch: "VCO 2 PITCH",
    vco2Shape: "VCO 2 SHAPE",
    vco2Level: "VCO 2 MIX",
    vco2Wave: "VCO 2 WAVE",
    vco2Octave: "VCO 2 OCTAVE",
    syncRing: "SYNC / RING",
    // Envelope
    envelopeAttack: "ATTACK",
    envelopeDecay: "DECAY",
    envelopeIntensity: "EG INT",
    envelopeType: "EG TYPE",
    envelopeTarget: "EG TARGET",
    // LFO
    lfoRate: "LFO RATE",
    lfoIntensity: "LFO INT",
    lfoMode: "LFO MODE",
    lfoType: "LFO WAVE",
    lfoTarget: "LFO TARGET",
    // Global
    masterLevel: "MASTER",
    drive: "DRIVE",
    keyboardOctave: "KEYBOARD OCTAVE",
    sequencerMode: "SEQ MODE",
    // Sequencer
    sequencerTempo: "SEQ TEMPO",
  };

  $: displayName = PARAM_DISPLAY_NAMES[paramName] ?? paramName;
  $: displayValue = String(value);
</script>

<div class="lcd-screen">
  {#if paramName}
    <div class="lcd-content">
      <div class="param-name">{displayName}</div>
      <div class="param-value">{displayValue}</div>
    </div>
  {/if}
</div>

<style>
  .lcd-screen {
    position: absolute;
    width: 71px;
    height: 41px;
    top: 192px;
    left: 635px;
    border: 1px solid #333;
    background-color: #333;
    border-radius: 2px;
  }

  .lcd-content {
    color: #0f0;
    font-family: monospace;
    font-size: 10px;
    padding: 5px;
    text-align: center;
  }

  .param-name {
    font-weight: bold;
  }

  .param-value {
    margin-top: 1px;
  }
</style>
