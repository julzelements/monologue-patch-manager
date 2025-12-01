<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import InvertibleKnob from "../knobs/InvertibleKnob.svelte";
  import VerticalToggle from "../toggles/VerticalToggle.svelte";
  import { CC_NAMES, LABELS } from "@julzelements/monologue-midi";
  import { synthStore, envelopeStore } from "$lib/stores";

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
    onValueChange?: (name: string, value: number) => void;
    onToggleChange?: (name: string, value: string) => void;
  } = $props();
  let typeRef = $state(typeValue ?? $envelopeStore.type);
  let targetRef = $state(targetValue ?? $envelopeStore.target);
  let attackRef = $state(attackValue ?? $envelopeStore.attack);
  let decayRef = $state(decayValue ?? $envelopeStore.decay);
  let intensityRef = $state(intensityValue ?? $envelopeStore.intensity);

  $effect(() => {
    if (typeRef !== $envelopeStore.type) {
      typeRef = $envelopeStore.type;
    }
    if (targetRef !== $envelopeStore.target) {
      targetRef = $envelopeStore.target;
    }
    if (attackRef !== $envelopeStore.attack) {
      attackRef = $envelopeStore.attack;
    }
    if (decayRef !== $envelopeStore.decay) {
      decayRef = $envelopeStore.decay;
    }
    if (intensityRef !== $envelopeStore.intensity) {
      intensityRef = $envelopeStore.intensity;
    }
  });

  function updateAttack(value: number) {
    attackRef = value;
    synthStore.setEnvelopeAttack(value);
    onValueChange?.("envelopeAttack", value);
  }

  function updateDecay(value: number) {
    decayRef = value;
    synthStore.setEnvelopeDecay(value);
    onValueChange?.("envelopeDecay", value);
  }

  function updateIntensity(value: number) {
    intensityRef = value;
    synthStore.setEnvelopeIntensity(value);
    onValueChange?.("envelopeIntensity", value);
  }

  function updateType(_name: string, label: string) {
    const labels = [...LABELS.EG_TYPE_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    typeRef = index;
    synthStore.setEnvelopeType(index);
    onToggleChange?.("envelopeType", label);
  }

  function updateTarget(_name: string, label: string) {
    const labels = [...LABELS.EG_TARGET_LABELS].reverse() as string[];
    const index = labels.indexOf(label as string);
    if (index === -1) return;

    targetRef = index;
    synthStore.setEnvelopeTarget(index);
    onToggleChange?.("envelopeTarget", label);
  }
</script>

<Knob
  knobId={CC_NAMES.ampEgAttack}
  name={"ATTACK"}
  top={47}
  left={541}
  initialValue={attackRef}
  onValueChange={(_, value) => updateAttack(value)}
/>
<Knob
  knobId={CC_NAMES.ampEgDecay}
  name={"DECAY"}
  top={47}
  left={615.5}
  initialValue={decayRef}
  onValueChange={(_, value) => updateDecay(value)}
/>
<InvertibleKnob
  knobId={CC_NAMES.egInt}
  name={"EG INT"}
  top={47}
  left={689}
  initialValue={intensityRef}
  onValueChange={(_, value) => updateIntensity(value)}
/>
<VerticalToggle
  id={CC_NAMES.egType}
  name={"EG TYPE"}
  top={40}
  left={497.5}
  positionNames={[...LABELS.EG_TYPE_LABELS].reverse()}
  initialValue={typeRef ?? 0}
  onValueChange={updateType}
/>
<VerticalToggle
  id={CC_NAMES.egTarget}
  name={"EG TARGET"}
  top={39}
  left={752.3}
  positionNames={[...LABELS.EG_TARGET_LABELS].reverse()}
  initialValue={targetRef ?? 0}
  onValueChange={updateTarget}
/>
