My layout for the monologue page

![A graphical synth interface with knobs and sliders](WIP.png)

[link to actual page:](https://julzelements.github.io/monologue-patch-manager/)

1. Create a Svelte project

npm create svelte@latest monologue-ui (SvelteKit)

cd monologue-ui

npm install

npm run dev

2. Move assets into project

Create folder: /static/assets (or /public/assets if using Vite)

Move:

mono-bare.svg

knobs.json

toggles.json

3. Create base component structure

Inside src/lib/:

SynthContainer.svelte

LcdScreen.svelte

Create folder: knobs/

Knob.svelte

KnobLabel.svelte (optional)

Create folder: toggles/

VerticalToggle.svelte

SequencerGrid.svelte (later)

Menus.svelte (later)
