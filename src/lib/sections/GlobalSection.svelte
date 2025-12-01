<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import KeyboardOctaveToggle from "../toggles/KeyboardOctaveToggle.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import { synthStore, globalStore } from "$lib/stores";

  const SEQUENCER_MODE_LABELS = ["NOTE", "SLIDE", "MOTION"] as const;

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
    onValueChange?: (name: string, value: number) => void;
    onToggleChange?: (name: string, value: string) => void;
  } = $props();

  let masterRef = $state($globalStore.masterLevel);
  let driveRef = $state(driveValue ?? $globalStore.drive);
  let keyboardOctaveRef = $state(keyboardOctaveValue ?? $globalStore.keyboardOctave);
  let sequencerModeRef = $state(sequencerModeValue ?? $globalStore.sequencerMode);

  $effect(() => {
    if (masterRef !== $globalStore.masterLevel) {
      masterRef = $globalStore.masterLevel;
    }
    if (driveRef !== $globalStore.drive) {
      driveRef = $globalStore.drive;
    }
    if (keyboardOctaveRef !== $globalStore.keyboardOctave) {
      keyboardOctaveRef = $globalStore.keyboardOctave;
    }
    if (sequencerModeRef !== $globalStore.sequencerMode) {
      sequencerModeRef = $globalStore.sequencerMode;
    }
  });

  function updateMaster(value: number) {
    masterRef = value;
    synthStore.setMasterLevel(value);
    onValueChange?.("masterLevel", value);
  }

  function updateDrive(value: number) {
    driveRef = value;
    synthStore.setDrive(value);
    onValueChange?.("drive", value);
  }

  function updateKeyboardOctave(_name: string, label: string) {
    const labels = [...LABELS.KEYBOARD_OCTAVE_LABELS] as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    keyboardOctaveRef = index;
    synthStore.setKeyboardOctave(index);
    onToggleChange?.("keyboardOctave", label);
  }

  function updateSequencerMode(_name: string, label: string) {
    const labels = [...SEQUENCER_MODE_LABELS] as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    sequencerModeRef = index;
    synthStore.setSequencerMode(index);
    onToggleChange?.("sequencerMode", label);
  }
</script>

<Knob
  knobId={"master"}
  name={"MASTER"}
  top={47}
  left={60}
  initialValue={masterRef}
  onValueChange={(_, value) => updateMaster(value)}
/>
<Knob
  knobId={CC_NAMES.drive}
  name={"DRIVE"}
  top={120}
  left={60}
  initialValue={driveRef}
  onValueChange={(_, value) => updateDrive(value)}
/>
<KeyboardOctaveToggle
  id={"keyboardOctave"}
  name={"KEYBOARD OCTAVE"}
  top={212.5}
  left={51}
  positionNames={[...LABELS.KEYBOARD_OCTAVE_LABELS]}
  initialValue={keyboardOctaveRef ?? 0}
  onValueChange={updateKeyboardOctave}
/>
<VerticalToggle
  id={"sequencerMode"}
  name={"SEQ MODE"}
  top={187.5}
  left={238.5}
  positionNames={[...SEQUENCER_MODE_LABELS]}
  initialValue={sequencerModeRef ?? 0}
  onValueChange={updateSequencerMode}
/>
