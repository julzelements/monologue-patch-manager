<script lang="ts">
  import { onMount } from "svelte";
  import VerticalToggle from "./toggles/VerticalToggle.svelte";
  import LcdScreen from "./menu/LcdScreen.svelte";
  import GlobalSection from "./sections/GlobalSection.svelte";
  import OscillatorOne from "./sections/OscillatorOne.svelte";
  import OscillatorTwo from "./sections/OscillatorTwo.svelte";
  import Filter from "./sections/Filter.svelte";
  import Envelope from "./sections/Envelope.svelte";
  import Lfo from "./sections/Lfo.svelte";
  import Sequencer from "./sections/Sequencer.svelte";
  import EditMenu from "./menu/EditMenu.svelte";
  import SequencerMenu from "./menu/SequencerMenu.svelte";
  import SequencerGrid from "./menu/SequencerGrid.svelte";
  import { prettyPanelSettings, type MonologueParameters, LABELS } from "@julzelements/monologue-midi";

  type PrettyPanelSettings = ReturnType<typeof prettyPanelSettings>;

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
</script>

<div id="synth-container" class="show-bg">
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

  <!-- Envelope -->
  <Envelope
    typeValue={rawPatch?.panelSettings.envelope.type.value}
    targetValue={rawPatch?.panelSettings.envelope.target.value}
    attackValue={rawPatch?.panelSettings.envelope.attack.value}
    decayValue={rawPatch?.panelSettings.envelope.decay.value}
    intensityValue={rawPatch?.panelSettings.envelope.intensity.value}
    onValueChange={handleKnobChange}
    onToggleChange={handleToggleChange}
  />

  <!-- LFO -->
  <Lfo
    rateValue={rawPatch?.panelSettings.lfo.rate.value}
    intensityValue={rawPatch?.panelSettings.lfo.intensity.value}
    modeValue={rawPatch?.panelSettings.lfo.type.value}
    waveValue={rawPatch?.panelSettings.lfo.type.value}
    onValueChange={handleKnobChange}
    onToggleChange={handleToggleChange}
  />

  <!-- Sequencer -->
  <Sequencer tempoValue={rawPatch?.sequencerSettings.bpm.value} onValueChange={handleKnobChange} />

  <!-- Toggles -->
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

  <!-- Edit Menu -->
  <EditMenu />

  <!-- Sequencer Menu -->
  <SequencerMenu />

  <!-- Sequencer Grid -->
  <SequencerGrid />
</div>

<style>
  :global(body) {
    margin: 0;
    background: #222;
    font-family: sans-serif;
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
</style>
