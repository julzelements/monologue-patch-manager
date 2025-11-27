<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import { CC_NAMES } from "@julzelements/monologue-midi";
  import type { MonologueCCEvent } from "$lib/midi/types";

  let {
    cutoffValue = undefined,
    resonanceValue = undefined,
    onValueChange,
  }: {
    cutoffValue?: number;
    resonanceValue?: number;
    onValueChange: (name: string, value: number) => void;
  } = $props();

  let cutoffRef = $state(cutoffValue);
  let resonanceRef = $state(resonanceValue);

  // Listen for MIDI parameter changes
  function handleParameterChange(event: MonologueCCEvent) {
    const { parameterId, normalisedValue } = event.detail;

    if (parameterId === "filterCutoff") {
      cutoffRef = normalisedValue * 1023;
    } else if (parameterId === "filterResonance") {
      resonanceRef = normalisedValue * 1023;
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

<Knob knobId={CC_NAMES.cutoff} name={"CUTOFF"} top={47} left={430} initialValue={cutoffRef} {onValueChange} />
<Knob knobId={CC_NAMES.resonance} name={"RESONANCE"} top={120} left={430} initialValue={resonanceRef} {onValueChange} />
