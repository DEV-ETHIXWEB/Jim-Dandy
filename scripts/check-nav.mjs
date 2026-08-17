import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 400 } });
const page = await context.newPage();
await page.goto("http://localhost:4321/?cachebust=" + Date.now(), { waitUntil: "networkidle" });
await page.waitForSelector("nav[aria-label='Primary']");
await page.screenshot({ path: "nav-check.png" });

const navBg = await page.evaluate(() => {
  const nav = document.querySelector("nav[aria-label='Primary']");
  const phone = document.querySelector("a[href^='tel:']");
  return {
    navBg: getComputedStyle(nav).backgroundImage,
    phoneBg: phone ? getComputedStyle(phone).backgroundImage : "not found",
  };
});
console.log(JSON.stringify(navBg, null, 2));
await browser.close();
