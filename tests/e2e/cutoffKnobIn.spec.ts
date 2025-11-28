import { test, expect } from "@playwright/test";
import { MidiTestPage } from "./utils/MidiTestPage";

test("handles MIDI note messages", async ({ page }) => {
  const midiPage = new MidiTestPage(page);

  await midiPage.goto();
  await midiPage.connectMidiDevice();

  await midiPage.sendMidiMessage([176, 43, 127]);

  const open = await page.$eval('[data-testid="knob-cutoff-dial"]', (el) => el.style.transform);
  await expect(open).toMatch(/rotate\(160deg\)/);

  await midiPage.sendMidiMessage([176, 43, 0]);

  const closed = await page.$eval('[data-testid="knob-cutoff-dial"]', (el) => el.style.transform);
  await expect(closed).toMatch(/rotate\(-160deg\)/);
});
