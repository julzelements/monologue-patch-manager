<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";

  export let rateValue: number | undefined = undefined;
  export let intensityValue: number | undefined = undefined;
  export let modeValue: number | undefined = undefined;
  export let waveValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: number) => void;
  export let onToggleChange: (name: string, value: string) => void;
</script>

<Knob knobId={CC_NAMES.lfoRate} name={"LFO RATE"} top={120} left={615.5} initialValue={rateValue} {onValueChange} />
<Knob knobId={CC_NAMES.lfoInt} name={"LFO INT"} top={120} left={689} initialValue={intensityValue} {onValueChange} />
<VerticalToggle
  id={CC_NAMES.lfoTarget}
  name={"LFO MODE"}
  top={114}
  left={551}
  positionNames={[...LABELS.LFO_MODE_LABELS].reverse()}
  initialValue={modeValue ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={CC_NAMES.lfoWave}
  name={"LFO WAVE"}
  top={114}
  left={497.5}
  positionNames={[...LABELS.LFO_TYPE_LABELS].reverse()}
  initialValue={waveValue ?? 0}
  onValueChange={onToggleChange}
/>
