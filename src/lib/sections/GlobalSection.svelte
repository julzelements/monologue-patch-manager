<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import KeyboardOctaveToggle from "../toggles/KeyboardOctaveToggle.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";

  let {
    driveValue = undefined,
    keyboardOctaveValue = undefined,
    sequencerModeValue = undefined,
    onValueChange,
    onToggleChange,
  }: {
    driveValue?: number;
    keyboardOctaveValue?: number;
    sequencerModeValue?: number;
    onValueChange: (name: string, value: number) => void;
    onToggleChange: (name: string, value: string) => void;
  } = $props();

  let driveRef = $state(driveValue);

  // Listen for MIDI parameter changes
  function handleParameterChange(event: CustomEvent) {
    const { parameterId, normalisedValue } = event.detail;

    if (parameterId === "drive") {
      driveRef = normalisedValue * 1023;
    }
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("midi:parameter" as any, handleParameterChange);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("midi:parameter" as any, handleParameterChange);
    }
  });
</script>

<Knob knobId={"master"} name={"MASTER"} top={47} left={60} initialValue={0} {onValueChange} />
<Knob knobId={CC_NAMES.drive} name={"DRIVE"} top={120} left={60} initialValue={driveRef} {onValueChange} />
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
