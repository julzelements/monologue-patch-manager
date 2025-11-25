<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";

  export let shapeValue: number | undefined = undefined;
  export let levelValue: number | undefined = undefined;
  export let waveValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: number) => void;
  export let onToggleChange: (name: string, value: string) => void;
</script>

<Knob knobId={CC_NAMES.vco1Shape} name={"VCO 1 SHAPE"} top={120} left={133} initialValue={shapeValue} {onValueChange} />
<Knob knobId={CC_NAMES.vco1Level} name={"VCO 1 MIX"} top={47} left={356} initialValue={levelValue} {onValueChange} />
<VerticalToggle
  id={CC_NAMES.vco1Wave}
  name={"VCO 1 WAVE"}
  top={40}
  left={143.5}
  positionNames={[...LABELS.VCO1_WAVE_LABELS].reverse()}
  initialValue={waveValue ?? 0}
  onValueChange={onToggleChange}
/>
