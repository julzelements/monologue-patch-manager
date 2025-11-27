<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import type { MonologueCCEvent } from "$lib/midi/types";

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
    onValueChange: (name: string, value: number) => void;
    onToggleChange: (name: string, value: string) => void;
  } = $props();

  let shapeRef = $state(shapeValue);
  let levelRef = $state(levelValue);
  let waveRef = $state(waveValue);

  // Listen for MIDI parameter changes
  function handleParameterChange(event: MonologueCCEvent) {
    const { parameterId, normalisedValue } = event.detail;

    if (parameterId === "vco1Shape") {
      shapeRef = normalisedValue * 1023;
    } else if (parameterId === "vco1Level") {
      levelRef = normalisedValue * 1023;
    } else if (parameterId === "vco1Wave") {
      waveRef = 2 - Math.round(normalisedValue * 2); // 0 -> 2 === top -> bottom
    } else if (parameterId === "vco1Pitch") {
      // VCO1 Pitch parameter available but not in this component
    } else if (parameterId === "vco1Octave") {
      // VCO1 Octave parameter available but not in this component
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

<Knob knobId={CC_NAMES.vco1Shape} name={"VCO 1 SHAPE"} top={120} left={133} initialValue={shapeRef} {onValueChange} />
<Knob knobId={CC_NAMES.vco1Level} name={"VCO 1 MIX"} top={47} left={356} initialValue={levelRef} {onValueChange} />
<VerticalToggle
  id={CC_NAMES.vco1Wave}
  name={"VCO 1 WAVE"}
  top={40}
  left={143.5}
  positionNames={[...LABELS.VCO1_WAVE_LABELS].reverse()}
  initialValue={waveRef ?? 0}
  onValueChange={onToggleChange}
/>
