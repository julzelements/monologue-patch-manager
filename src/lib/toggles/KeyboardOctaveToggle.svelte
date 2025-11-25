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

<div class="keyboard-octave-toggle" style="top: {top}px; left: {left}px;" {id}>
  <div class="keyboard-octave-knob h-pos-{position}"></div>
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

  /* 5-pole positions */
  .h-pos-0 {
    transform: translateX(0px);
  }

  .h-pos-1 {
    transform: translateX(8px);
  }

  .h-pos-2 {
    transform: translateX(16px);
  }

  .h-pos-3 {
    transform: translateX(23px);
  }

  .h-pos-4 {
    transform: translateX(31px);
  }
</style>
