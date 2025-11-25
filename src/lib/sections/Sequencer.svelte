<script lang="ts">
  import Knob from "../knobs/Knob.svelte";

  export let tempoValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: number) => void;
</script>

<Knob knobId={"tempo"} name={"TEMPO"} top={47} left={801} initialValue={tempoValue} {onValueChange} />

<!-- Key Trig Hold -->
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
