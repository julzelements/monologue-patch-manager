<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import Vco2Toggle from "../toggles/Vco2Toggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";

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
    onValueChange: (name: string, value: number) => void;
    onToggleChange: (name: string, value: string) => void;
  } = $props();

  let pitchRef = $state(pitchValue);
  let shapeRef = $state(shapeValue);
  let levelRef = $state(levelValue);
  let waveRef = $state(waveValue);
  let octaveRef = $state(octaveValue);
  let syncRingRef = $state(syncRingValue);

  // Listen for MIDI parameter changes
  function handleParameterChange(event: CustomEvent) {
    const { parameterId, normalisedValue } = event.detail;

    if (parameterId === "vco2Pitch") {
      pitchRef = normalisedValue * 1023;
    } else if (parameterId === "vco2Shape") {
      shapeRef = normalisedValue * 1023;
    } else if (parameterId === "vco2Level") {
      levelRef = normalisedValue * 1023;
    } else if (parameterId === "vco2Wave") {
      waveRef = 2 - Math.round(normalisedValue * 2); // 0 -> 2 === top -> bottom
    } else if (parameterId === "vco2Octave") {
      octaveRef = 3 - Math.round(normalisedValue * 3); // 0 -> 3 === top -> bottom
    } else if (parameterId === "syncRing") {
      syncRingRef = 2 - Math.round(normalisedValue * 2); // 0 -> 2 === top -> bottom
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

<Knob knobId={CC_NAMES.vco2Pitch} name={"VCO 2 PITCH"} top={47} left={282.5} initialValue={pitchRef} {onValueChange} />
<Knob knobId={CC_NAMES.vco2Shape} name={"VCO 2 SHAPE"} top={120} left={282.5} initialValue={shapeRef} {onValueChange} />
<Knob knobId={CC_NAMES.vco2Level} name={"VCO 2 MIX"} top={120} left={356} initialValue={levelRef} {onValueChange} />
<Vco2Toggle
  id={CC_NAMES.vco1Octave}
  name={"VCO 1 OCTAVE"}
  top={40}
  left={202}
  positionNames={[...LABELS.OCTAVE_LABELS].reverse()}
  initialValue={octaveRef ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={CC_NAMES.vco2Wave}
  name={"VCO 2 WAVE"}
  top={114}
  left={202}
  positionNames={[...LABELS.VCO2_WAVE_LABELS].reverse()}
  initialValue={waveRef ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={CC_NAMES.syncRing}
  name={"SYNC"}
  top={114}
  left={238.5}
  positionNames={[...LABELS.SYNC_RING_LABELS].reverse()}
  initialValue={syncRingRef ?? 0}
  onValueChange={onToggleChange}
/>
