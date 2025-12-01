<script lang="ts">
  import Knob from "../knobs/Knob.svelte";
  import { synthStore, sequencerStore } from "$lib/stores";

  let {
    tempoValue = undefined,
    onValueChange,
  }: {
    tempoValue?: number;
    onValueChange?: (name: string, value: number) => void;
  } = $props();

  let tempoRef = $state(tempoValue ?? $sequencerStore.tempo);

  $effect(() => {
    if (tempoRef !== $sequencerStore.tempo) {
      tempoRef = $sequencerStore.tempo;
    }
  });

  function updateTempo(value: number) {
    tempoRef = value;
    synthStore.setSequencerTempo(value);
    onValueChange?.("sequencerTempo", value);
  }
</script>

<Knob
  knobId={"tempo"}
  name={"TEMPO"}
  top={47}
  left={801}
  initialValue={tempoRef}
  maxValue={240}
  onValueChange={(_, value) => updateTempo(value)}
/>

<!-- Key Trig Hold  TODO: Add the boolean functionality and saving to sysex-->
<div class="key-trig-hold"></div>

<style>
  .key-trig-hold {
    position: absolute;
    top: 125px;
    left: 803px;
    width: 32px;
    height: 28px;
    background-color: rgb(82, 150, 173);
    border: 1px solid #333;
    border-radius: 2px;
  }
</style>
