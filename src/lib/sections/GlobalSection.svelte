<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import KeyboardOctaveToggle from "../toggles/KeyboardOctaveToggle.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";

  export let driveValue: number | undefined = undefined;
  export let keyboardOctaveValue: number | undefined = undefined;
  export let sequencerModeValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: number) => void;
  export let onToggleChange: (name: string, value: string) => void;
</script>

<Knob knobId={"master"} name={"MASTER"} top={47} left={60} initialValue={0} {onValueChange} />
<Knob knobId={CC_NAMES.drive} name={"DRIVE"} top={120} left={60} initialValue={driveValue} {onValueChange} />
<KeyboardOctaveToggle
  id={"keyboardOctave"}
  name={"KEYBOARD OCTAVE"}
  top={212.5}
  left={51}
  positionNames={[...LABELS.KEYBOARD_OCTAVE_LABELS]}
  initialValue={keyboardOctaveValue ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={"sequencerMode"}
  name={"SEQ MODE"}
  top={187.5}
  left={238.5}
  positionNames={["MOTION", "SLIDE", "NOTE"]}
  initialValue={sequencerModeValue ?? 0}
  onValueChange={onToggleChange}
/>
