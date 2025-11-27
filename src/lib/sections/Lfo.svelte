<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import type { MonologueParameterChangeEvent } from "$lib/midi/types";

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
    onValueChange: (name: string, value: number) => void;
    onToggleChange: (name: string, value: string) => void;
  } = $props();

  let rateRef = $state(rateValue);
  let intensityRef = $state(intensityValue);
  let modeRef = $state(modeValue);
  let waveRef = $state(waveValue);
  let targetRef = $state(targetValue);

  // Listen for MIDI parameter changes
  function handleParameterChange(event: MonologueParameterChangeEvent) {
    const { parameterId, normalisedValue } = event.detail;

    if (parameterId === "lfoRate") {
      rateRef = normalisedValue * 1023;
    } else if (parameterId === "lfoIntensity") {
      intensityRef = normalisedValue * 1023;
    } else if (parameterId === "lfoTarget") {
      targetRef = 2 - Math.round(normalisedValue * 2); // 0 -> 2 === top -> bottom
    } else if (parameterId === "lfoType") {
      waveRef = 2 - Math.round(normalisedValue * 2); // 0 -> 2 === top -> bottom
    } else if (parameterId === "lfoMode") {
      modeRef = 2 - Math.round(normalisedValue * 2); // 0 -> 2 === top -> bottom
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

<Knob knobId={CC_NAMES.lfoRate} name={"LFO RATE"} top={120} left={615.5} initialValue={rateRef} {onValueChange} />
<Knob knobId={CC_NAMES.lfoInt} name={"LFO INT"} top={120} left={689} initialValue={intensityRef} {onValueChange} />
<VerticalToggle
  id={CC_NAMES.lfoTarget}
  name={"LFO MODE"}
  top={114}
  left={551}
  positionNames={[...LABELS.LFO_MODE_LABELS].reverse()}
  initialValue={modeRef ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={CC_NAMES.lfoWave}
  name={"LFO WAVE"}
  top={114}
  left={497.5}
  positionNames={[...LABELS.LFO_TYPE_LABELS].reverse()}
  initialValue={waveRef ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={"lfoTarget"}
  name={"LFO TARGET"}
  top={113}
  left={752.3}
  positionNames={[...LABELS.LFO_TARGET_LABELS].reverse()}
  initialValue={targetRef ?? 0}
  onValueChange={onToggleChange}
/>
