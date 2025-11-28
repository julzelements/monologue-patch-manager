<script lang="ts">
  export let id: string;
  export let name: string;
  export let top: number;
  export let left: number;
  export let positionNames: string[] | undefined = undefined;
  export let knobPositions: number[] = [0.9, 8, 16, 23, 31]; // X offsets for the knob
  export let indicatorPositions: number[] = [-6.5, 7.8, 22, 36.3, 50.7]; // X offsets for the indicator
  export let initialValue: number | undefined = undefined;
  export let onValueChange: (name: string, value: string) => void;

  let position = 0;
  let initializedValue: number | undefined = undefined;

  // 5-pole toggle for keyboard octave
  $: defaultPositionNames = ["-2", "-1", "0", "+1", "+2"];
  $: names = positionNames || defaultPositionNames;

  // Initialize position from initialValue
  $: if (initialValue !== undefined && initialValue !== initializedValue) {
    position = Math.min(Math.max(initialValue, 0), 4);
    initializedValue = initialValue;
  }

  function handleClick(pos: number) {
    position = pos;
    onValueChange(name, names[pos]);
  }
</script>

<div
  class="keyboard-octave-toggle"
  style="top: {top}px; left: {left}px;"
  {id}
  data-testid={`keyboard-octave-toggle-${id}`}
>
  <div class="keyboard-octave-indicator" style="transform: translateX({indicatorPositions[position]}px);"></div>
  <div class="keyboard-octave-knob" style="transform: translateX({knobPositions[position]}px);"></div>
  {#each Array(5) as _, i}
    <div
      class="keyboard-octave-zone"
      role="button"
      tabindex="0"
      aria-label="{name} {names[i]}"
      on:click={() => handleClick(i)}
      on:keydown={(e) => e.key === "Enter" && handleClick(i)}
    ></div>
  {/each}
</div>

<style>
  .keyboard-octave-toggle {
    border: 1px solid black;
    position: absolute;
    width: 46px;
    height: 14px;
    background: #ddd;
    border-radius: 21px;
    padding: 2px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .keyboard-octave-zone {
    flex: 1;
    height: 100%;
    cursor: pointer;
    z-index: 1;
  }

  .keyboard-octave-knob {
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

  .keyboard-octave-knob::after {
    content: "";
    width: 8px;
    height: 8px;
    background: #ddd;
    border-radius: 50%;
    border: 1px solid #999;
  }

  .keyboard-octave-indicator {
    position: absolute;
    top: -23.3px;
    width: 7px;
    height: 7px;
    background: red;
    border-radius: 50%;
    /* transition: transform 0.15s ease; */
    pointer-events: none;
    z-index: 3;
    box-shadow:
      0 0 4px rgba(255, 0, 0, 0.8),
      0 0 8px rgba(255, 0, 0, 0.4);
  }
</style>
