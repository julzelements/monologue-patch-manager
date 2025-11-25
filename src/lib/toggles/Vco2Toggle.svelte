<script lang="ts">
  export let id: string;
  export let name: string;
  export let top: number;
  export let left: number;
  export let positionNames: string[] | undefined = undefined;
  export let knobPositions: number[] = [0, 10, 21, 31]; // Y offsets for the knob
  export let indicatorPositions: number[] = [-8.4, 5.9, 20.3, 34.5]; // Y offsets for the indicator
  export let initialValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: string) => void;

  let position = 0;
  let initializedValue: number | undefined = undefined;

  // 4-pole toggle always has 4 positions
  $: defaultPositionNames = ["1", "2", "3", "4"];
  $: names = positionNames || defaultPositionNames;

  // Initialize position from initialValue
  $: if (initialValue !== undefined && initialValue !== initializedValue) {
    position = Math.min(Math.max(initialValue, 0), 3);
    initializedValue = initialValue;
  }

  function handleClick(pos: number) {
    position = pos;
    onValueChange(name, names[pos]);
  }
</script>

<div class="vco2-toggle" style="top: {top}px; left: {left}px;" {id}>
  <div class="vco2-indicator" style="transform: translateY({indicatorPositions[position]}px);"></div>
  <div class="vco2-knob" style="transform: translateY({knobPositions[position]}px);"></div>
  {#each Array(4) as _, i}
    <div
      class="vco2-zone"
      role="button"
      tabindex="0"
      aria-label="{name} {names[i]}"
      on:click={() => handleClick(i)}
      on:keydown={(e) => e.key === "Enter" && handleClick(i)}
    ></div>
  {/each}
</div>

<style>
  .vco2-toggle {
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

  .vco2-zone {
    flex: 1;
    width: 100%;
    cursor: pointer;
    z-index: 1;
  }

  .vco2-knob {
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

  .vco2-knob::after {
    content: "";
    width: 8px;
    height: 8px;
    background: #ddd;
    border-radius: 50%;
    border: 1px solid #999;
  }

  .vco2-indicator {
    position: absolute;
    left: 36.7px;
    top: 8px;
    width: 7px;
    height: 7px;
    background: red;
    border-radius: 50%;
    pointer-events: none;
    z-index: 3;
    box-shadow:
      0 0 4px rgba(255, 0, 0, 0.8),
      0 0 8px rgba(255, 0, 0, 0.4);
  }
</style>
