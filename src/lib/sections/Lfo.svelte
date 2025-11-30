<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import InvertibleKnob from "../knobs/InvertibleKnob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import { synthStore, lfoStore } from "$lib/stores";

  let {
    rateValue = undefined,
    intensityValue = undefined,
    modeValue = undefined,
    waveValue = undefined,
    targetValue = undefined,
    onValueChange,
    onToggleChange,
  }: {
    rateValue?: number;
    intensityValue?: number;
    modeValue?: number;
    waveValue?: number;
    targetValue?: number;
    onValueChange?: (name: string, value: number) => void;
    onToggleChange?: (name: string, value: string) => void;
  } = $props();
  let rateRef = $state(rateValue ?? $lfoStore.rate);
  let intensityRef = $state(intensityValue ?? $lfoStore.intensity);
  let modeRef = $state(modeValue ?? $lfoStore.mode);
  let waveRef = $state(waveValue ?? $lfoStore.wave);
  let targetRef = $state(targetValue ?? $lfoStore.target);

  $effect(() => {
    if (rateRef !== $lfoStore.rate) {
      rateRef = $lfoStore.rate;
    }
    if (intensityRef !== $lfoStore.intensity) {
      intensityRef = $lfoStore.intensity;
    }
    if (modeRef !== $lfoStore.mode) {
      modeRef = $lfoStore.mode;
    }
    if (waveRef !== $lfoStore.wave) {
      waveRef = $lfoStore.wave;
    }
    if (targetRef !== $lfoStore.target) {
      targetRef = $lfoStore.target;
    }
  });

  function updateRate(value: number) {
    rateRef = value;
    synthStore.setLfoRate(value);
    onValueChange?.("lfoRate", value);
  }

  function updateIntensity(value: number) {
    intensityRef = value;
    synthStore.setLfoIntensity(value);
    onValueChange?.("lfoIntensity", value);
  }

  function updateMode(name: string, label: string) {
    const labels = [...LABELS.LFO_MODE_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    modeRef = index;
    synthStore.setLfoMode(index);
    onToggleChange?.("lfoMode", label);
  }

  function updateWave(name: string, label: string) {
    const labels = [...LABELS.LFO_TYPE_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    waveRef = index;
    synthStore.setLfoWave(index);
    onToggleChange?.("lfoType", label);
  }

  function updateTarget(name: string, label: string) {
    const labels = [...LABELS.LFO_TARGET_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    targetRef = index;
    synthStore.setLfoTarget(index);
    onToggleChange?.("lfoTarget", label);
  }
</script>

<Knob
  knobId={CC_NAMES.lfoRate}
  name={"LFO RATE"}
  top={120}
  left={615.5}
  initialValue={rateRef}
  onValueChange={(_, value) => updateRate(value)}
/>
<InvertibleKnob
  knobId={CC_NAMES.lfoInt}
  name={"LFO INT"}
  top={120}
  left={689}
  initialValue={intensityRef}
  onValueChange={(_, value) => updateIntensity(value)}
/>
<VerticalToggle
  id={CC_NAMES.lfoTarget}
  name={"LFO MODE"}
  top={114}
  left={551}
  positionNames={[...LABELS.LFO_MODE_LABELS].reverse()}
  initialValue={modeRef ?? 0}
  onValueChange={updateMode}
/>
<VerticalToggle
  id={CC_NAMES.lfoWave}
  name={"LFO WAVE"}
  top={114}
  left={497.5}
  positionNames={[...LABELS.LFO_TYPE_LABELS].reverse()}
  initialValue={waveRef ?? 0}
  onValueChange={updateWave}
/>
<VerticalToggle
  id={"lfoTarget"}
  name={"LFO TARGET"}
  top={113}
  left={752.3}
  positionNames={[...LABELS.LFO_TARGET_LABELS].reverse()}
  initialValue={targetRef ?? 0}
  onValueChange={updateTarget}
/>
