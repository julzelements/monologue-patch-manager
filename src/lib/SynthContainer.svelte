<script lang="ts">
  import { onMount } from "svelte";
  import Knob from "./knobs/Knob.svelte";
  import VerticalToggle from "./toggles/VerticalToggle.svelte";
  import Vco2Toggle from "./toggles/Vco2Toggle.svelte";
  import KeyboardOctaveToggle from "./toggles/KeyboardOctaveToggle.svelte";
  import LcdScreen from "./LcdScreen.svelte";
  import GlobalSection from "./sections/GlobalSection.svelte";
  import OscillatorOne from "./sections/OscillatorOne.svelte";
  import OscillatorTwo from "./sections/OscillatorTwo.svelte";
  import Filter from "./sections/Filter.svelte";
  import { CC_NAMES, prettyPanelSettings, type MonologueParameters, LABELS } from "@julzelements/monologue-midi";

  type PrettyPanelSettings = ReturnType<typeof prettyPanelSettings>;

  let showBackground = true;
  let currentParamName = "";
  let currentValue: string | number = "";
  let rawPatch: MonologueParameters | null = null;
  let prettyPatch: PrettyPanelSettings | null = null;

  onMount(async () => {
    try {
      const patchRes = await fetch("/patches/<afx_acid3>.json");
      rawPatch = await patchRes.json();

      // Use prettyPanelSettings to validate and format the patch
      if (rawPatch) {
        prettyPatch = prettyPanelSettings(rawPatch);
        console.log("Raw patch:", rawPatch);
        console.log("Pretty patch:", prettyPatch);
      }
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
</script>

<button class="bg-toggle" class:off={!showBackground} on:click={toggleBackground}>
  {showBackground ? "BG ON" : "BG OFF"}
</button>

<div id="synth-container" class:show-bg={showBackground}>
  <!-- Global Section -->
  <GlobalSection
    driveValue={rawPatch?.panelSettings.drive.value}
    keyboardOctaveValue={rawPatch?.panelSettings.keyboardOctave.value}
    sequencerModeValue={0}
    onValueChange={handleKnobChange}
    onToggleChange={handleToggleChange}
  />

  <!-- Oscillator One -->
  <OscillatorOne
    shapeValue={rawPatch?.panelSettings.oscilators.vco1.shape.value}
    levelValue={rawPatch?.panelSettings.oscilators.vco1.level.value}
    waveValue={rawPatch?.panelSettings.oscilators.vco1.wave.value}
    onValueChange={handleKnobChange}
    onToggleChange={handleToggleChange}
  />

  <!-- Oscillator Two -->
  <OscillatorTwo
    pitchValue={rawPatch?.panelSettings.oscilators.vco2.pitch.value}
    shapeValue={rawPatch?.panelSettings.oscilators.vco2.shape.value}
    levelValue={rawPatch?.panelSettings.oscilators.vco2.level.value}
    waveValue={rawPatch?.panelSettings.oscilators.vco2.wave.value}
    octaveValue={rawPatch?.panelSettings.oscilators.vco1.octave.value}
    syncRingValue={rawPatch?.panelSettings.syncRing.value}
    onValueChange={handleKnobChange}
    onToggleChange={handleToggleChange}
  />

  <!-- Filter -->
  <Filter
    cutoffValue={rawPatch?.panelSettings.filter.cutoff.value}
    resonanceValue={rawPatch?.panelSettings.filter.resonance.value}
    onValueChange={handleKnobChange}
  />

  <!-- Knobs -->
  <Knob
    knobId={CC_NAMES.ampEgAttack}
    name={"ATTACK"}
    top={47}
    left={541}
    initialValue={rawPatch?.panelSettings.envelope.attack.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.ampEgDecay}
    name={"DECAY"}
    top={47}
    left={615.5}
    initialValue={rawPatch?.panelSettings.envelope.decay.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.lfoRate}
    name={"LFO RATE"}
    top={120}
    left={615.5}
    initialValue={rawPatch?.panelSettings.lfo.rate.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.egInt}
    name={"EG INT"}
    top={47}
    left={689}
    initialValue={rawPatch?.panelSettings.envelope.intensity.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.lfoInt}
    name={"LFO INT"}
    top={120}
    left={689}
    initialValue={rawPatch?.panelSettings.lfo.intensity.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={"tempo"}
    name={"TEMPO"}
    top={47}
    left={801}
    initialValue={rawPatch?.sequencerSettings.bpm.value}
    onValueChange={handleKnobChange}
  />
  <!-- Toggles -->
  <VerticalToggle
    id={CC_NAMES.egTarget}
    name={"EG TARGET"}
    top={39}
    left={752.3}
    positionNames={[...LABELS.EG_TARGET_LABELS]}
    initialValue={rawPatch?.panelSettings.envelope.target.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <VerticalToggle
    id={CC_NAMES.vco2Wave}
    name={"EG TYPE"}
    top={40}
    left={497.5}
    positionNames={[...LABELS.EG_TYPE_LABELS]}
    initialValue={rawPatch?.panelSettings.envelope.type.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <VerticalToggle
    id={CC_NAMES.lfoTarget}
    name={"LFO MODE"}
    top={114}
    left={551}
    positionNames={[...LABELS.LFO_MODE_LABELS].reverse()}
    initialValue={rawPatch?.panelSettings.lfo.type.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <VerticalToggle
    id={CC_NAMES.lfoWave}
    name={"LFO WAVE"}
    top={114}
    left={497.5}
    positionNames={[...LABELS.LFO_TYPE_LABELS].reverse()}
    initialValue={rawPatch?.panelSettings.lfo.type.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <VerticalToggle
    id={"seqTarget"}
    name={"SEQ TARGET"}
    top={113}
    left={752.3}
    positionNames={[...LABELS.BOOLEAN_LABELS].reverse()}
    initialValue={rawPatch?.panelSettings.seqTrig.value ?? 0}
    onValueChange={handleToggleChange}
  />

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
