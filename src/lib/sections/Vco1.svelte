<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import { synthStore, vco1Store } from "$lib/stores";

  let {
    shapeValue = undefined,
    levelValue = undefined,
    waveValue = undefined,
    onValueChange,
    onToggleChange,
  }: {
    shapeValue?: number;
    levelValue?: number;
    waveValue?: number;
    onValueChange?: (name: string, value: number) => void;
    onToggleChange?: (name: string, value: string) => void;
  } = $props();
  let shapeRef = $state(shapeValue ?? $vco1Store.shape);
  let levelRef = $state(levelValue ?? $vco1Store.level);
  let waveRef = $state(waveValue ?? $vco1Store.wave);

  $effect(() => {
    if (shapeRef !== $vco1Store.shape) {
      shapeRef = $vco1Store.shape;
    }
    if (levelRef !== $vco1Store.level) {
      levelRef = $vco1Store.level;
    }
    if (waveRef !== $vco1Store.wave) {
      waveRef = $vco1Store.wave;
    }
  });

  function updateShape(value: number) {
    shapeRef = value;
    synthStore.setVco1Shape(value);
    onValueChange?.("vco1Shape", value);
  }

  function updateLevel(value: number) {
    levelRef = value;
    synthStore.setVco1Level(value);
    onValueChange?.("vco1Level", value);
  }

  function updateWave(name: string, label: string) {
    const labels = [...LABELS.VCO1_WAVE_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    waveRef = index;
    synthStore.setVco1Wave(index);
    onToggleChange?.("vco1Wave", label);
  }

  // VCO1 now reacts only to store updates; MIDI is handled centrally.
</script>

<Knob
  knobId={CC_NAMES.vco1Shape}
  name={"VCO 1 SHAPE"}
  top={120}
  left={133}
  initialValue={shapeRef}
  onValueChange={(_, value) => updateShape(value)}
/>
<Knob
  knobId={CC_NAMES.vco1Level}
  name={"VCO 1 MIX"}
  top={47}
  left={356}
  initialValue={levelRef}
  onValueChange={(_, value) => updateLevel(value)}
/>
<VerticalToggle
  id={CC_NAMES.vco1Wave}
  name={"VCO 1 WAVE"}
  top={40}
  left={143.5}
  positionNames={[...LABELS.VCO1_WAVE_LABELS].reverse()}
  initialValue={waveRef ?? 0}
  onValueChange={updateWave}
/>
