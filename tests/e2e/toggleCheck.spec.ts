import { test, expect } from "@playwright/test";

test.describe("toggle controls", () => {
  test("keyboard octave and sequencer mode toggles render", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "KEYBOARD OCTAVE -2" }).click();
    const lcd = page.locator(".lcd-screen");
    await expect(lcd).toContainText("-2");
    const keyboardOctaveToggle = page.getByTestId("keyboard-octave-toggle-keyboardOctave");
    await expect(keyboardOctaveToggle).toHaveScreenshot("keyboardDownTwo.png");

    await page.getByRole("button", { name: "KEYBOARD OCTAVE 0" }).click();
    await expect(lcd).toContainText("0");
    await expect(keyboardOctaveToggle).toHaveScreenshot("keyboardZero.png");

    await page.getByRole("button", { name: "KEYBOARD OCTAVE +2" }).click();
    await expect(lcd).toContainText("+2");
    await expect(keyboardOctaveToggle).toHaveScreenshot("keyboardUp2.png");

    await page.getByRole("button", { name: "KEYBOARD OCTAVE +2" }).click();
    await page.getByRole("button", { name: "KEYBOARD OCTAVE 0" }).click();
  });
});
