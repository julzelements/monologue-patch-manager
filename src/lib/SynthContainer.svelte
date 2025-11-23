<script lang="ts">
  import { onMount } from "svelte";
  import Knob from "./knobs/Knob.svelte";
  import VerticalToggle from "./toggles/VerticalToggle.svelte";
  import HorizontalToggle from "./toggles/HorizontalToggle.svelte";
  import LcdScreen from "./LcdScreen.svelte";

  let knobsConfig: Record<string, { name: string; top: number; left: number }> = {};
  let togglesConfig: Record<string, { name: string; top: number; left: number; type: string; poles?: number }> = {};
  let showBackground = true;
  let currentParamName = "";
  let currentValue: string | number = "";
  let patch: any;

  onMount(async () => {
    try {
      const [knobsRes, togglesRes, initialPatch] = await Promise.all([
        fetch("/knobs.json"),
        fetch("/toggles.json"),
        fetch("/patches/<afx_acid3>.json"),
      ]);
      knobsConfig = await knobsRes.json();
      togglesConfig = await togglesRes.json();
      patch = await initialPatch.json();
    } catch (error) {
      console.error("Error loading configuration:", error);
    }
  });

  function handleKnobChange(name: string, value: number) {
    currentParamName = name;
    currentValue = value;
  }

  function handleToggleChange(name: string, value: string) {
    currentParamName = name;
    currentValue = value;
  }

  function toggleBackground() {
    showBackground = !showBackground;
  }

  // Map knob IDs to their corresponding patch values
  function getKnobInitialValue(knobId: string): number | undefined {
    if (!patch?.panelSettings) {
      console.log("No patch.panelSettings", patch);
      return undefined;
    }

    const mapping: Record<string, number | undefined> = {
      cutoff: patch.panelSettings.filter?.cutoff?.value,
      resonance: patch.panelSettings.filter?.resonance?.value,
      vco1Mixer: patch.panelSettings.oscilators?.vco1?.level?.value,
      vco1Shape: patch.panelSettings.oscilators?.vco1?.shape?.value,
      vco2Pitch: patch.panelSettings.oscilators?.vco2?.pitch?.value,
      vco2Mixer: patch.panelSettings.oscilators?.vco2?.level?.value,
      vco2Shape: patch.panelSettings.oscilators?.vco2?.shape?.value,
      egAttack: patch.panelSettings.envelope?.attack?.value,
      egDecay: patch.panelSettings.envelope?.decay?.value,
      egInt: patch.panelSettings.envelope?.intensity?.value,
      lfoRate: patch.panelSettings.lfo?.rate?.value,
      lfoInt: patch.panelSettings.lfo?.intensity?.value,
      drive: patch.panelSettings.drive?.value,
      tempo: patch.sequencerSettings?.bpm?.value,
      master: 0,
    };

    console.log(`getKnobInitialValue(${knobId}) = ${mapping[knobId]}`);
    return mapping[knobId];
  }
</script>

<button class="bg-toggle" class:off={!showBackground} on:click={toggleBackground}>
  {showBackground ? "BG ON" : "BG OFF"}
</button>

<div id="synth-container" class:show-bg={showBackground}>
  <!-- Knobs -->
  {#if patch}
    {#each Object.entries(knobsConfig) as [knobId, config]}
      <Knob
        {knobId}
        name={config.name}
        top={config.top}
        left={config.left}
        initialValue={getKnobInitialValue(knobId)}
        onValueChange={handleKnobChange}
      />
    {/each}
  {:else}
    {#each Object.entries(knobsConfig) as [knobId, config]}
      <Knob
        {knobId}
        name={config.name}
        top={config.top}
        left={config.left}
        initialValue={undefined}
        onValueChange={handleKnobChange}
      />
    {/each}
  {/if}

  <!-- Toggles -->
  {#each Object.entries(togglesConfig).filter(([_, cfg]) => cfg.type === "vertical") as [id, config]}
    <VerticalToggle
      {id}
      name={config.name}
      top={config.top}
      left={config.left}
      poles={config.poles || 3}
      onValueChange={handleToggleChange}
    />
  {/each}

  <!-- Horizontal Toggles -->
  {#each Object.entries(togglesConfig).filter(([_, cfg]) => cfg.type === "horizontal") as [id, config]}
    <HorizontalToggle
      {id}
      name={config.name}
      top={config.top}
      left={config.left}
      poles={config.poles || 3}
      onValueChange={handleToggleChange}
    />
  {/each}

  <!-- LCD Screen -->
  <LcdScreen paramName={currentParamName} value={currentValue} />

  <!-- Key Trig Hold -->
  <div class="key-trig-hold"></div>

  <!-- Edit Menu -->
  <div class="edit-menu-container">
    <div class="menu-button"></div>
    <div class="menu-button"></div>
    <div class="menu-button"></div>
  </div>

  <!-- Sequencer Menu -->
  <div class="sequencer-menu-container">
    <div class="menu-button"></div>
    <div class="menu-button"></div>
    <div class="menu-button"></div>
    <div class="menu-button"></div>
  </div>

  <!-- Sequencer Grid -->
  <div class="sequencer-container">
    {#each Array(16) as _, i}
      <div class="square"></div>
    {/each}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #222;
    font-family: sans-serif;
  }

  .bg-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(40, 40, 40, 0.9);
    border: 2px solid #00ffff;
    border-radius: 6px;
    color: #00ffff;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.2s ease;
  }

  .bg-toggle:hover {
    background: rgba(60, 60, 60, 0.9);
    box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  }

  .bg-toggle.off {
    border-color: #666;
    color: #666;
  }

  #synth-container {
    position: relative;
    width: 900px;
    height: 400px;
    margin: 20px auto;
    background: #f38989;
    border: 2px solid #000000;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }

  #synth-container.show-bg {
    background-image: url("/assets/mono-bare.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .key-trig-hold {
    position: absolute;
    top: 125px;
    left: 803px;
    width: 32px;
    height: 28px;
    background-color: rgb(82, 150, 173);
    border: 1px solid #333;
    border-radius: 2px;
  }

  .edit-menu-container {
    display: grid;
    grid-template-columns: repeat(3, 32px);
    gap: 4.6px;
    position: absolute;
    left: 322px;
    top: 205.2px;
  }

  .sequencer-menu-container {
    display: grid;
    grid-template-columns: repeat(4, 32px);
    gap: 4.6px;
    position: absolute;
    left: 470.2px;
    top: 205.2px;
  }

  .menu-button {
    height: 15px;
    width: 32px;
    background-color: rgb(82, 150, 173);
    border: 1px solid #333;
    border-radius: 2px;
  }

  .sequencer-container {
    display: grid;
    grid-template-columns: repeat(16, 32px);
    gap: 5px;
    position: absolute;
    left: 248.5px;
    top: 282px;
  }

  .square {
    width: 31px;
    height: 28px;
    background-color: rgb(82, 150, 173);
    border: 1px solid #333;
    border-radius: 2px;
  }
</style>
