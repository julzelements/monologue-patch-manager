<script lang="ts">
  export let knobId: string;
  export let name: string;
  export let top: number;
  export let left: number;
  export let initialValue: number | undefined = undefined;
  export let maxValue: number = 1023;
  export let onValueChange: (name: string, value: number) => void;
  export let inverted: boolean = false;

  let currentRot = 0;
  let lastRot = 0;
  let isPointerDown = false;
  let startY = 0;
  let initializedValue: number | undefined = undefined;

  const maxRot = 160;
  const speed = 1.5;

  function emitValueFromRotation() {
    const raw = Math.round(((currentRot + maxRot) / (maxRot * 2)) * maxValue);
    const clamped = Math.min(Math.max(raw, 0), maxValue);

    // Map 0–maxValue from the knob into 0–127 space
    const midi = (clamped / maxValue) * 127;

    let effectiveMidi: number;

    if (inverted) {
      // Inverted: map full travel 0–127 down to 63–0 linearly
      const t = midi / 127; // 0..1 across dial
      effectiveMidi = 63 * (1 - t); // 63..0
    } else {
      // Non-inverted: map full travel 0–127 up to 64–127 linearly
      const t = midi / 127; // 0..1 across dial
      effectiveMidi = 64 + (127 - 64) * t; // 64..127
    }

    const valueForCallback = Math.round((effectiveMidi / 127) * maxValue);
    onValueChange(name, valueForCallback);
  }

  // Initialize rotation from initialValue (0-maxValue range)
  $: if (initialValue !== undefined && initialValue !== initializedValue) {
    const normalized = initialValue / maxValue; // Convert to 0-1 range
    currentRot = normalized * maxRot * 2 - maxRot; // Convert to -160 to 160 range
    lastRot = currentRot;
    initializedValue = initialValue;
    console.log(`InvertibleKnob ${knobId} initialized to ${initialValue}, rotation: ${currentRot}`);
  }

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

    emitValueFromRotation();
  }

  function handlePointerUp() {
    lastRot = currentRot;
    isPointerDown = false;
  }

  function handleInvertClick() {
    inverted = !inverted;
    emitValueFromRotation();
  }
</script>

<svelte:window on:pointermove={handlePointerMove} on:pointerup={handlePointerUp} />

<div
  class="invertible-knob"
  style="top: {top}px; left: {left}px;"
  id={knobId}
  data-testid={`invertible-knob-${knobId}`}
>
  <div
    class="knob-dial {inverted ? 'knob-dial--inverted' : ''}"
    style="transform: rotate({currentRot}deg);"
    on:pointerdown={handlePointerDown}
    role="slider"
    tabindex="0"
    aria-label={name}
    aria-valuenow={Math.round(((currentRot + maxRot) / (maxRot * 2)) * maxValue)}
    aria-valuemin="0"
    aria-valuemax={maxValue}
    data-testid={`invertible-knob-${knobId}-dial`}
  >
    <div class="knob-pointer"></div>
  </div>
  <button class="invert-button" type="button" aria-pressed={inverted} on:click={handleInvertClick}>INVERT</button>
</div>

<style>
  .invertible-knob {
    width: 35px;
    height: 35px;
    position: absolute;
  }

  .knob-dial {
    width: 35px;
    height: 35px;
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

  .knob-dial--inverted {
    background: #884444;
    border-color: #dd6666;
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

  .invert-button {
    position: absolute;
    left: 5px;
    bottom: -28px;
    font-family: "Raleway", sans-serif;
    font-size: 8px;
    font-weight: 600;
    height: auto;
    padding: 0;
    border-radius: 0;
    border: none;
    background: transparent;
    color: #000;
    text-shadow: 0.5px 0.5px 0 rgba(75, 75, 75, 0.5);
    cursor: pointer;
  }

  .invert-button:hover {
    text-decoration: underline;
  }
</style>
