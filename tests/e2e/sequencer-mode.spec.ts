import { test, expect } from "@playwright/test";

test.describe("sequencer mode toggle", () => {
  test("cycles through MOTION, SLIDE, NOTE", async ({ page }) => {
    await page.goto("/");

    const lcd = page.locator(".lcd-screen");
    const seqToggle = page.getByTestId("vertical-toggle-sequencerMode");

    // MOTION (top)
    await page.getByRole("button", { name: "SEQ MODE MOTION" }).click();
    await expect(lcd).toContainText("SEQ MODE");
    await expect(lcd).toContainText("MOTION");
    await expect(seqToggle).toHaveScreenshot("seqMode-motion.png");

    // SLIDE (middle)
    await page.getByRole("button", { name: "SEQ MODE SLIDE" }).click();
    await expect(lcd).toContainText("SEQ MODE");
    await expect(lcd).toContainText("SLIDE");
    await expect(seqToggle).toHaveScreenshot("seqMode-slide.png");

    // NOTE (bottom)
    await page.getByRole("button", { name: "SEQ MODE NOTE" }).click();
    await expect(lcd).toContainText("SEQ MODE");
    await expect(lcd).toContainText("NOTE");
    await expect(seqToggle).toHaveScreenshot("seqMode-note.png");
  });
});
