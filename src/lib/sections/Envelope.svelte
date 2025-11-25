<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";

  export let typeValue: number | undefined = undefined;
  export let attackValue: number | undefined = undefined;
  export let decayValue: number | undefined = undefined;
  export let intensityValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: number) => void;
  export let onToggleChange: (name: string, value: string) => void;
</script>

<Knob knobId={CC_NAMES.ampEgAttack} name={"ATTACK"} top={47} left={541} initialValue={attackValue} {onValueChange} />
<Knob knobId={CC_NAMES.ampEgDecay} name={"DECAY"} top={47} left={615.5} initialValue={decayValue} {onValueChange} />
<Knob knobId={CC_NAMES.egInt} name={"EG INT"} top={47} left={689} initialValue={intensityValue} {onValueChange} />
<VerticalToggle
  id={CC_NAMES.vco2Wave}
  name={"EG TYPE"}
  top={40}
  left={497.5}
  positionNames={[...LABELS.EG_TYPE_LABELS].reverse()}
  initialValue={typeValue ?? 0}
  onValueChange={onToggleChange}
/>
