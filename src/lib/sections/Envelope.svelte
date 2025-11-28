<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Knob from "../knobs/Knob.svelte";
  import InvertibleKnob from "../knobs/InvertibleKnob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import type { MonologueCCEvent } from "$lib/midi/types";

  let {
    typeValue = undefined,
    targetValue = undefined,
    attackValue = undefined,
    decayValue = undefined,
    intensityValue = undefined,
    onValueChange,
    onToggleChange,
  }: {
    typeValue?: number;
    targetValue?: number;
    attackValue?: number;
    decayValue?: number;
    intensityValue?: number;
    onValueChange: (name: string, value: number) => void;
    onToggleChange: (name: string, value: string) => void;
  } = $props();

  let typeRef = $state(typeValue);
  let targetRef = $state(targetValue);
  let attackRef = $state(attackValue);
  let decayRef = $state(decayValue);
  let intensityRef = $state(intensityValue);

  // Listen for MIDI parameter changes
  function handleParameterChange(event: MonologueCCEvent) {
    const { parameterId, normalisedValue } = event.detail;

    if (parameterId === "envelopeAttack") {
      attackRef = normalisedValue * 1023;
    } else if (parameterId === "envelopeDecay") {
      decayRef = normalisedValue * 1023;
    } else if (parameterId === "envelopeIntensity") {
      intensityRef = normalisedValue * 1023;
    } else if (parameterId === "envelopeType") {
      typeRef = 2 - Math.round(normalisedValue * 2); // 0 -> 2 === top -> bottom
    } else if (parameterId === "envelopeTarget") {
      targetRef = 2 - Math.round(normalisedValue * 2); // 0 -> 2 === top -> bottom
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

<Knob knobId={CC_NAMES.ampEgAttack} name={"ATTACK"} top={47} left={541} initialValue={attackRef} {onValueChange} />
<Knob knobId={CC_NAMES.ampEgDecay} name={"DECAY"} top={47} left={615.5} initialValue={decayRef} {onValueChange} />
<InvertibleKnob
  knobId={CC_NAMES.egInt}
  name={"EG INT"}
  top={47}
  left={689}
  initialValue={intensityRef}
  {onValueChange}
/>
<VerticalToggle
  id={CC_NAMES.vco2Wave}
  name={"EG TYPE"}
  top={40}
  left={497.5}
  positionNames={[...LABELS.EG_TYPE_LABELS].reverse()}
  initialValue={typeRef ?? 0}
  onValueChange={onToggleChange}
/>
<VerticalToggle
  id={CC_NAMES.egTarget}
  name={"EG TARGET"}
  top={39}
  left={752.3}
  positionNames={[...LABELS.EG_TARGET_LABELS].reverse()}
  initialValue={targetRef ?? 0}
  onValueChange={onToggleChange}
/>
