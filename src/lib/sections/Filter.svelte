<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import { CC_NAMES } from "@julzelements/monologue-midi";
  import type { MonologueCCEvent } from "$lib/midi/types";
  import { synthStore, filterStore } from "$lib/stores";

  let {
    cutoffValue = undefined,
    resonanceValue = undefined,
    onValueChange,
  }: {
    cutoffValue?: number;
    resonanceValue?: number;
    onValueChange: (name: string, value: number) => void;
  } = $props();

  let cutoffRef = $state(cutoffValue ?? $filterStore.cutoff);
  let resonanceRef = $state(resonanceValue ?? $filterStore.resonance);

  // Keep local refs in sync only when the store changes independently
  $effect(() => {
    if (cutoffRef !== $filterStore.cutoff) {
      cutoffRef = $filterStore.cutoff;
    }
    if (resonanceRef !== $filterStore.resonance) {
      resonanceRef = $filterStore.resonance;
    }
  });

  function updateCutoff(value: number) {
    cutoffRef = value;
    synthStore.setFilterCutoff(value);
    onValueChange?.("filterCutoff", value);
  }

  function updateResonance(value: number) {
    resonanceRef = value;
    synthStore.setFilterResonance(value);
    onValueChange?.("filterResonance", value);
  }

  // Listen for MIDI parameter changes
  function handleParameterChange(event: MonologueCCEvent) {
    const { parameterId, normalisedValue } = event.detail;

    const value = normalisedValue * 1023;

    if (parameterId === "filterCutoff") {
      updateCutoff(value);
    } else if (parameterId === "filterResonance") {
      updateResonance(value);
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
  knobId={CC_NAMES.cutoff}
  name={"CUTOFF"}
  top={47}
  left={430}
  initialValue={cutoffRef}
  onValueChange={(_, value) => updateCutoff(value)}
/>
<Knob
  knobId={CC_NAMES.resonance}
  name={"RESONANCE"}
  top={120}
  left={430}
  initialValue={resonanceRef}
  onValueChange={(_, value) => updateResonance(value)}
/>
