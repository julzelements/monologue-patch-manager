<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import KeyboardOctaveToggle from "../toggles/KeyboardOctaveToggle.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import { synthStore, globalStore } from "$lib/stores";

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

  let masterRef = $state(0);
  let driveRef = $state(driveValue ?? $globalStore.drive);
  let keyboardOctaveRef = $state(keyboardOctaveValue ?? $globalStore.keyboardOctave);
  let sequencerModeRef = $state(sequencerModeValue ?? $globalStore.sequencerMode);

  $effect(() => {
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

  function updateKeyboardOctave(name: string, label: string) {
    const labels = [...LABELS.KEYBOARD_OCTAVE_LABELS] as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    keyboardOctaveRef = index;
    synthStore.setKeyboardOctave(index);
    onToggleChange?.("keyboardOctave", label);
  }

  function updateSequencerMode(name: string, label: string) {
    const labels = ["NOTE", "SLIDE", "MOTION"];
    const index = labels.indexOf(label);
    if (index === -1) return;

    sequencerModeRef = index;
    synthStore.setSequencerMode(index);
    onToggleChange?.("sequencerMode", label);
  }

  // Listen for MIDI parameter changes
  function handleParameterChange(event: CustomEvent) {
    const { parameterId, normalisedValue } = event.detail;

    if (parameterId === "drive") {
      const value = normalisedValue * 1023;
      updateDrive(value);
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
  positionNames={["NOTE", "SLIDE", "MOTION"]}
  initialValue={sequencerModeRef ?? 0}
  onValueChange={updateSequencerMode}
/>
