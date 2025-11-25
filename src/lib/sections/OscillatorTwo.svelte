<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import Vco2Toggle from "../toggles/Vco2Toggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";

  export let pitchValue: number | undefined = undefined;
  export let shapeValue: number | undefined = undefined;
  export let waveValue: number | undefined = undefined;
  export let octaveValue: number | undefined = undefined;
  export let syncRingValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: number) => void;
  export let onToggleChange: (name: string, value: string) => void;
</script>

<Knob
  knobId={CC_NAMES.vco2Pitch}
  name={"VCO 2 PITCH"}
  top={47}
  left={282.5}
  initialValue={pitchValue}
  {onValueChange}
/>
<Knob
  knobId={CC_NAMES.vco2Shape}
  name={"VCO 2 SHAPE"}
  top={120}
  left={282.5}
  initialValue={shapeValue}
  {onValueChange}
/>
<Vco2Toggle
  id={CC_NAMES.vco1Octave}
  name={"VCO 1 OCTAVE"}
  top={40}
  left={202}
  positionNames={[...LABELS.OCTAVE_LABELS].reverse()}
  initialValue={octaveValue ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={CC_NAMES.vco2Wave}
  name={"VCO 2 WAVE"}
  top={114}
  left={202}
  positionNames={[...LABELS.VCO2_WAVE_LABELS].reverse()}
  initialValue={waveValue ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={CC_NAMES.syncRing}
  name={"SYNC"}
  top={114}
  left={238.5}
  positionNames={[...LABELS.SYNC_RING_LABELS].reverse()}
  initialValue={syncRingValue ?? 0}
  onValueChange={onToggleChange}
/>
