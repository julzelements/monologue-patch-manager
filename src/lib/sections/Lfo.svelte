<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";

  let {
    rateValue = undefined,
    intensityValue = undefined,
    modeValue = undefined,
    waveValue = undefined,
    onValueChange,
    onToggleChange,
  }: {
    rateValue?: number;
    intensityValue?: number;
    modeValue?: number;
    waveValue?: number;
    onValueChange: (name: string, value: number) => void;
    onToggleChange: (name: string, value: string) => void;
  } = $props();

  let rateRef = $state(rateValue);
  let intensityRef = $state(intensityValue);
  let modeRef = $state(modeValue);
  let waveRef = $state(waveValue);

  // Listen for MIDI parameter changes
  function handleParameterChange(event: CustomEvent) {
    const { parameterId, normalisedValue } = event.detail;

    if (parameterId === "lfoRate") {
      rateRef = normalisedValue * 1023;
    } else if (parameterId === "lfoIntensity") {
      intensityRef = normalisedValue * 1023;
    } else if (parameterId === "lfoTarget") {
      modeRef = normalisedValue * 1023;
    } else if (parameterId === "lfoType") {
      waveRef = normalisedValue * 1023;
    } else if (parameterId === "lfoMode") {
      // Note: lfoMode might be a separate parameter from lfoTarget
      // Check which one corresponds to the MODE toggle
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
