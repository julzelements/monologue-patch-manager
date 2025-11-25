<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import { CC_NAMES } from "@julzelements/monologue-midi";

  export let cutoffValue: number | undefined = undefined;
  export let resonanceValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: number) => void;
</script>

<Knob knobId={CC_NAMES.cutoff} name={"CUTOFF"} top={47} left={430} initialValue={cutoffValue} {onValueChange} />
<Knob
  knobId={CC_NAMES.resonance}
  name={"RESONANCE"}
  top={120}
  left={430}
  initialValue={resonanceValue}
  {onValueChange}
/>
