<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import Vco2Toggle from "../toggles/Vco2Toggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import { synthStore, vco2Store } from "$lib/stores";

  let {
    pitchValue = undefined,
    shapeValue = undefined,
    levelValue = undefined,
    waveValue = undefined,
    octaveValue = undefined,
    syncRingValue = undefined,
    onValueChange,
    onToggleChange,
  }: {
    pitchValue?: number;
    shapeValue?: number;
    levelValue?: number;
    waveValue?: number;
    octaveValue?: number;
    syncRingValue?: number;
    onValueChange?: (name: string, value: number) => void;
    onToggleChange?: (name: string, value: string) => void;
  } = $props();
  let pitchRef = $state(pitchValue ?? $vco2Store.pitch);
  let shapeRef = $state(shapeValue ?? $vco2Store.shape);
  let levelRef = $state(levelValue ?? $vco2Store.level);
  let waveRef = $state(waveValue ?? $vco2Store.wave);
  let octaveRef = $state(octaveValue ?? $vco2Store.octave);
  let syncRingRef = $state(syncRingValue ?? $vco2Store.syncRing);

  $effect(() => {
    if (pitchRef !== $vco2Store.pitch) {
      pitchRef = $vco2Store.pitch;
    }
    if (shapeRef !== $vco2Store.shape) {
      shapeRef = $vco2Store.shape;
    }
    if (levelRef !== $vco2Store.level) {
      levelRef = $vco2Store.level;
    }
    if (waveRef !== $vco2Store.wave) {
      waveRef = $vco2Store.wave;
    }
    if (octaveRef !== $vco2Store.octave) {
      octaveRef = $vco2Store.octave;
    }
    if (syncRingRef !== $vco2Store.syncRing) {
      syncRingRef = $vco2Store.syncRing;
    }
  });

  function updatePitch(value: number) {
    pitchRef = value;
    synthStore.setVco2Pitch(value);
    onValueChange?.("vco2Pitch", value);
  }

  function updateShape(value: number) {
    shapeRef = value;
    synthStore.setVco2Shape(value);
    onValueChange?.("vco2Shape", value);
  }

  function updateLevel(value: number) {
    levelRef = value;
    synthStore.setVco2Level(value);
    onValueChange?.("vco2Level", value);
  }

  function updateWave(name: string, label: string) {
    const labels = [...LABELS.VCO2_WAVE_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    waveRef = index;
    synthStore.setVco2Wave(index);
    onToggleChange?.("vco2Wave", label);
  }

  function updateOctave(name: string, label: string) {
    const labels = [...LABELS.OCTAVE_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    octaveRef = index;
    synthStore.setVco2Octave(index);
    onToggleChange?.("vco2Octave", label);
  }

  function updateSyncRing(name: string, label: string) {
    const labels = [...LABELS.SYNC_RING_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    syncRingRef = index;
    synthStore.setSyncRing(index);
    onToggleChange?.("syncRing", label);
  }
</script>

<Knob
  knobId={CC_NAMES.vco2Pitch}
  name={"VCO 2 PITCH"}
  top={47}
  left={282.5}
  initialValue={pitchRef}
  onValueChange={(_, value) => updatePitch(value)}
/>
<Knob
  knobId={CC_NAMES.vco2Shape}
  name={"VCO 2 SHAPE"}
  top={120}
  left={282.5}
  initialValue={shapeRef}
  onValueChange={(_, value) => updateShape(value)}
/>
<Knob
  knobId={CC_NAMES.vco2Level}
  name={"VCO 2 MIX"}
  top={120}
  left={356}
  initialValue={levelRef}
  onValueChange={(_, value) => updateLevel(value)}
/>
<Vco2Toggle
  id={CC_NAMES.vco2Octave}
  name={"VCO 2 OCTAVE"}
  top={40}
  left={202}
  positionNames={[...LABELS.OCTAVE_LABELS].reverse()}
  initialValue={octaveRef ?? 0}
  onValueChange={updateOctave}
/>
<VerticalToggle
  id={CC_NAMES.vco2Wave}
  name={"VCO 2 WAVE"}
  top={114}
  left={202}
  positionNames={[...LABELS.VCO2_WAVE_LABELS].reverse()}
  initialValue={waveRef ?? 0}
  onValueChange={updateWave}
/>
<VerticalToggle
  id={CC_NAMES.syncRing}
  name={"SYNC"}
  top={114}
  left={238.5}
  positionNames={[...LABELS.SYNC_RING_LABELS].reverse()}
  initialValue={syncRingRef ?? 0}
  onValueChange={updateSyncRing}
/>
