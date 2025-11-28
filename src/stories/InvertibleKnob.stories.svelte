<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import InvertibleKnob from "$lib/knobs/InvertibleKnob.svelte";
  import { fn } from "storybook/test";

  const { Story } = defineMeta({
    title: "Controls/InvertibleKnob",
    component: InvertibleKnob,
    tags: ["autodocs"],
    argTypes: {
      initialValue: { control: { type: "range", min: 0, max: 1023, step: 1 } },
      maxValue: { control: { type: "number" } },
      inverted: { control: { type: "boolean" } },
    },
    args: {
      onValueChange: fn(),
    },
  });
</script>

<Story
  name="Normal Min"
  args={{
    knobId: "test-invertible-knob",
    name: "EG INT",
    top: 0,
    left: 0,
    initialValue: 0,
    maxValue: 1023,
    inverted: false,
  }}
/>

<Story
  name="Normal Mid"
  args={{
    knobId: "test-invertible-knob",
    name: "EG INT",
    top: 0,
    left: 0,
    initialValue: 512,
    maxValue: 1023,
    inverted: false,
  }}
/>

<Story
  name="Normal Max"
  args={{
    knobId: "test-invertible-knob",
    name: "EG INT",
    top: 0,
    left: 0,
    initialValue: 1023,
    maxValue: 1023,
    inverted: false,
  }}
/>

<Story
  name="Inverted Min"
  args={{
    knobId: "test-invertible-knob",
    name: "EG INT",
    top: 0,
    left: 0,
    initialValue: 0,
    maxValue: 1023,
    inverted: true,
  }}
/>

<Story
  name="Inverted Mid"
  args={{
    knobId: "test-invertible-knob",
    name: "EG INT",
    top: 0,
    left: 0,
    initialValue: 512,
    maxValue: 1023,
    inverted: true,
  }}
/>

<Story
  name="Inverted Max"
  args={{
    knobId: "test-invertible-knob",
    name: "EG INT",
    top: 0,
    left: 0,
    initialValue: 1023,
    maxValue: 1023,
    inverted: true,
  }}
/>
