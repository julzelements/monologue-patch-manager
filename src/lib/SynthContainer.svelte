<script lang="ts">
  import { onMount } from "svelte";
  import Knob from "./knobs/Knob.svelte";
  import VerticalToggle from "./toggles/VerticalToggle.svelte";
  import Vco2Toggle from "./toggles/Vco2Toggle.svelte";
  import KeyboardOctaveToggle from "./toggles/KeyboardOctaveToggle.svelte";
  import LcdScreen from "./LcdScreen.svelte";
  import { CC_NAMES, prettyPanelSettings, type MonologueParameters, LABELS } from "@julzelements/monologue-midi";

  type PrettyPanelSettings = ReturnType<typeof prettyPanelSettings>;

  let knobsConfig: Record<string, { name: string; top: number; left: number }> = {};
  let togglesConfig: Record<string, { name: string; top: number; left: number; type: string; poles?: number }> = {};
  let showBackground = true;
  let currentParamName = "";
  let currentValue: string | number = "";
  let rawPatch: MonologueParameters | null = null;
  let prettyPatch: PrettyPanelSettings | null = null;

  onMount(async () => {
    try {
      const [knobsRes, togglesRes, patchRes] = await Promise.all([
        fetch("/knobs.json"),
        fetch("/toggles.json"),
        fetch("/patches/<afx_acid3>.json"),
      ]);

      knobsConfig = await knobsRes.json();
      togglesConfig = await togglesRes.json();
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
  <!-- Knobs -->
  <Knob knobId={"master"} name={"MASTER"} top={47} left={60} initialValue={0} onValueChange={handleKnobChange} />
  <Knob
    knobId={CC_NAMES.drive}
    name={"DRIVE"}
    top={120}
    left={60}
    initialValue={rawPatch?.panelSettings.drive.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.vco1Shape}
    name={"VCO 1 SHAPE"}
    top={120}
    left={133}
    initialValue={rawPatch?.panelSettings.oscilators.vco1.shape.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.vco2Pitch}
    name={"VCO 2 PITCH"}
    top={47}
    left={282.5}
    initialValue={rawPatch?.panelSettings.oscilators.vco2.pitch.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.vco2Shape}
    name={"VCO 2 SHAPE"}
    top={120}
    left={282.5}
    initialValue={rawPatch?.panelSettings.oscilators.vco2.shape.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.vco1Level}
    name={"VCO 1 MIX"}
    top={47}
    left={356}
    initialValue={rawPatch?.panelSettings.oscilators.vco1.level.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.vco2Level}
    name={"VCO 2 MIX"}
    top={120}
    left={356}
    initialValue={rawPatch?.panelSettings.oscilators.vco2.level.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.cutoff}
    name={"CUTOFF"}
    top={47}
    left={430}
    initialValue={rawPatch?.panelSettings.filter.cutoff.value}
    onValueChange={handleKnobChange}
  />
  <Knob
    knobId={CC_NAMES.resonance}
    name={"RESONANCE"}
    top={120}
    left={430}
    initialValue={rawPatch?.panelSettings.filter.resonance.value}
    onValueChange={handleKnobChange}
  />
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
    id={CC_NAMES.vco1Wave}
    name={"VCO 1 WAVE"}
    top={40}
    left={143.5}
    positionNames={[...LABELS.VCO1_WAVE_LABELS].reverse()}
    initialValue={rawPatch?.panelSettings.oscilators.vco1.wave.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <Vco2Toggle
    id={CC_NAMES.vco1Octave}
    name={"VCO 1 OCTAVE"}
    top={40}
    left={202}
    positionNames={[...LABELS.OCTAVE_LABELS].reverse()}
    initialValue={rawPatch?.panelSettings.oscilators.vco1.octave.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <VerticalToggle
    id={CC_NAMES.vco2Wave}
    name={"VCO 2 WAVE"}
    top={114}
    left={202}
    positionNames={[...LABELS.VCO2_WAVE_LABELS].reverse()}
    initialValue={rawPatch?.panelSettings.oscilators.vco2.wave.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <VerticalToggle
    id={CC_NAMES.syncRing}
    name={"SYNC"}
    top={114}
    left={238.5}
    positionNames={[...LABELS.SYNC_RING_LABELS].reverse()}
    initialValue={rawPatch?.panelSettings.syncRing.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <VerticalToggle
    id={CC_NAMES.egTarget}
    name={"EG TARGET"}
    top={39}
    left={752.3}
    positionNames={[...LABELS.EG_TARGET_LABELS].reverse()}
    initialValue={rawPatch?.panelSettings.envelope.target.value ?? 0}
    onValueChange={handleToggleChange}
  />
  <VerticalToggle
    id={CC_NAMES.vco2Wave}
    name={"EG TYPE"}
    top={40}
    left={497.5}
    positionNames={[...LABELS.EG_TYPE_LABELS].reverse()}
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
  <VerticalToggle
    id={"sequencerMode"}
    name={"SEQ MODE"}
    top={187.5}
    left={238.5}
    positionNames={["MOTION", "SLIDE", "NOTE"]}
    initialValue={0}
    onValueChange={handleToggleChange}
  />

  <KeyboardOctaveToggle
    id={"keyboardOctave"}
    name={"KEYBOARD OCTAVE"}
    top={212.5}
    left={51}
    positionNames={[...LABELS.KEYBOARD_OCTAVE_LABELS]}
    initialValue={rawPatch?.panelSettings.keyboardOctave.value ?? 0}
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
