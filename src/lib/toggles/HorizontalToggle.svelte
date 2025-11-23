<script lang="ts">
  export let id: string;
  export let name: string;
  export let top: number;
  export let left: number;
  export let poles: number = 3; // Default to 3 poles
  export let onValueChange: (name: string, value: string) => void;

  let position = 0;
  
  // Generate position names based on number of poles
  $: positionNames = poles === 2 
    ? ['OFF', 'ON'] 
    : poles === 3
    ? ['LEFT', 'MID', 'RIGHT']
    : Array.from({ length: poles }, (_, i) => String(i + 1));

  function handleClick(pos: number) {
    position = pos;
    onValueChange(name, positionNames[pos]);
  }
</script>

<div class="horizontal-toggle" class:two-pole={poles === 2} style="top: {top}px; left: {left}px;" {id}>
  <div class="horizontal-knob h-pos-{position} poles-{poles}"></div>
  {#each Array(poles) as _, i}
    <div 
      class="horizontal-zone" 
      role="button" 
      tabindex="0" 
      aria-label="{name} {positionNames[i]}" 
      on:click={() => handleClick(i)} 
      on:keydown={(e) => e.key === 'Enter' && handleClick(i)}
    ></div>
  {/each}
</div>

<style>
  .horizontal-toggle {
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

  .horizontal-toggle.two-pole {
    width: 31px;
  }

  .horizontal-zone {
    flex: 1;
    height: 100%;
    cursor: pointer;
    z-index: 1;
  }

  .horizontal-knob {
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

  .horizontal-knob::after {
    content: '';
    width: 8px;
    height: 8px;
    background: #ddd;
    border-radius: 50%;
    border: 1px solid #999;
  }

  /* 2-pole positions */
  .h-pos-0.poles-2 {
    transform: translateX(0px);
  }

  .h-pos-1.poles-2 {
    transform: translateX(17px);
  }

  /* 3-pole positions */
  .h-pos-0.poles-3 {
    transform: translateX(0px);
  }

  .h-pos-1.poles-3 {
    transform: translateX(17px);
  }

  .h-pos-2.poles-3 {
    transform: translateX(31px);
  }

  /* 4-pole positions */
  .h-pos-0.poles-4 {
    transform: translateX(0px);
  }

  .h-pos-1.poles-4 {
    transform: translateX(10px);
  }

  .h-pos-2.poles-4 {
    transform: translateX(21px);
  }

  .h-pos-3.poles-4 {
    transform: translateX(31px);
  }

  /* 5-pole positions */
  .h-pos-0.poles-5 {
    transform: translateX(0px);
  }

  .h-pos-1.poles-5 {
    transform: translateX(8px);
  }

  .h-pos-2.poles-5 {
    transform: translateX(16px);
  }

  .h-pos-3.poles-5 {
    transform: translateX(23px);
  }

  .h-pos-4.poles-5 {
    transform: translateX(31px);
  }
</style>
