// TODO: when the app deals with sending MIDI out to the hardware.

// import { test, expect } from "@playwright/test";
// import { MidiTestPage } from "./utils/MidiTestPage";

// test("has title", async ({ page }) => {
//   await page.goto("localhost:5173");
//   await expect(page).toHaveTitle(/Monologue Patch Manager/);
// });

// test("Tweak cutoff with mouse", async ({ page }) => {
//   const midiPage = new MidiTestPage(page);
//   await midiPage.goto();
//   await midiPage.connectMidiDevice();

//   const locator = page.getByTestId("knob-cutoff");
//   const box = await locator.boundingBox();

//   if (!box) throw new Error("Element not found or not visible");

//   const startX = box.x + box.width / 2;
//   const startY = box.y + box.height / 2;

//   const beforeTweak = await page.$eval('[data-testid="knob-cutoff-dial"]', (el) => el.style.transform);
//   await expect(beforeTweak).toMatch(/rotate\(0deg\)/);

//   // tweak to maximum
//   await page.mouse.move(startX, startY);
//   await page.mouse.down();
//   await page.mouse.move(0, startY, { steps: 20 });
//   await page.mouse.move(0, startY + 100, { steps: 20 });
//   await page.mouse.up();
//   const afterTweak = await page.$eval('[data-testid="knob-cutoff-dial"]', (el) => el.style.transform);
//   await expect(afterTweak).toMatch(/rotate\(-150deg\)/);
//   const messages = await midiPage.getMessages();
//   expect(messages.length).toBeGreaterThan(0);
//   const last = Array.from(messages.pop() ?? []);
//   expect(last).toStrictEqual([191, 43, 127]);

// tweak to minimum
// await page.mouse.move(startX, startY);
// await page.mouse.down();
// await page.mouse.move(0, startY, { steps: 20 });
// await page.mouse.move(0, startY + 100, { steps: 20 });
// await page.mouse.up();
// });
