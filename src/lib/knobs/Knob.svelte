<script lang="ts">
  export let id: string;
  export let name: string;
  export let top: number;
  export let left: number;
  export let onValueChange: (name: string, value: number) => void;

  let currentRot = 0;
  let lastRot = 0;
  let isPointerDown = false;
  let startY = 0;

  const maxRot = 160;
  const speed = 1.5;

  function handlePointerDown(event: PointerEvent) {
    isPointerDown = true;
    startY = event.clientY;
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isPointerDown) return;

    let delta = startY - event.clientY;
    currentRot = lastRot + delta * speed;

    if (currentRot > maxRot) currentRot = maxRot;
    if (currentRot < -maxRot) currentRot = -maxRot;

    const value = Math.round(((currentRot + maxRot) / (maxRot * 2)) * 1023);
    const clampedValue = Math.min(Math.max(value, 0), 1023);
    onValueChange(name, clampedValue);
  }

  function handlePointerUp() {
    lastRot = currentRot;
    isPointerDown = false;
  }
</script>

<svelte:window on:pointermove={handlePointerMove} on:pointerup={handlePointerUp} />

<div class="knob" style="top: {top}px; left: {left}px;" {id}>
  <div
    class="knob-dial"
    style="transform: rotate({currentRot}deg);"
    on:pointerdown={handlePointerDown}
    role="slider"
    tabindex="0"
    aria-label={name}
    aria-valuenow={(((currentRot + maxRot) / (maxRot * 2)) * 1023).toFixed(0)}
    aria-valuemin="0"
    aria-valuemax="1023"
  >
    <div class="knob-pointer"></div>
  </div>
</div>

<style>
  .knob {
    width: 35px;
    height: 35px;
    position: absolute;
  }

  .knob-dial {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #444;
    border: 2px solid #222;
    position: relative;
    display: flex;
    justify-content: center;
    transform-origin: center center;
    align-items: center;
    touch-action: none;
    cursor: pointer;
  }

  .knob-pointer {
    width: 3px;
    height: 15px;
    background: #ffcc00;
    border-radius: 2px;
    position: absolute;
    top: 3px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
