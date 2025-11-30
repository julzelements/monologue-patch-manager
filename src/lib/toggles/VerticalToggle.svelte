<script lang="ts">
  export let id: string;
  export let name: string;
  export let top: number;
  export let left: number;
  export let positionNames: string[] | undefined = undefined;
  export let initialValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: string) => void;

  let position = 0;
  let initializedValue: number | undefined = undefined;

  // 3-pole toggle always has 3 positions
  $: defaultPositionNames = ["HIGH", "MID", "LOW"];
  $: names = positionNames || defaultPositionNames;

  // Initialize position from initialValue
  $: if (initialValue !== undefined && initialValue !== initializedValue) {
    position = Math.min(Math.max(initialValue, 0), 2);
    initializedValue = initialValue;
  }

  function handleClick(pos: number) {
    position = pos;
    onValueChange(name, names[pos]);
  }
</script>

<div class="vertical-toggle" style="top: {top}px; left: {left}px;" {id} data-testid={`vertical-toggle-${id}`}>
  <div class="vertical-knob v-pos-{position}"></div>
  {#each Array(3) as _, i}
    <div class="vertical-zone" role="button" tabindex="0" aria-label="{name} {names[i]}"></div>
  {/each}
</div>

<style>
  .vertical-toggle {
    border: 1px solid black;
    position: absolute;
    width: 14px;
    height: 46px;
    background: #ddd;
    border-radius: 21px;
    padding: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .vertical-zone {
    flex: 1;
    width: 100%;
    cursor: pointer;
    z-index: 1;
  }

  .vertical-knob {
    border: 1px solid black;
    position: absolute;
    top: 3px;
    left: 3px;
    width: 11px;
    height: 11px;
    background: white;
    border-radius: 50%;
    transition: transform 0.15s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vertical-knob::after {
    content: "";
    width: 8px;
    height: 8px;
    background: #ddd;
    border-radius: 50%;
    border: 1px solid #999;
  }

  /* 3-pole positions */
  .v-pos-0 {
    transform: translateY(0px);
  }

  .v-pos-1 {
    transform: translateY(17px);
  }

  .v-pos-2 {
    transform: translateY(31px);
  }
</style>
