import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const extPath = path.resolve('C:/Users/21604/Desktop/谷歌 (2)/谷歌/extension');
const userDataDir = path.resolve('C:/Users/21604/Desktop/谷歌 (2)/tmp-pw-profile');
if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

const context = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  args: [
    `--disable-extensions-except=${extPath}`,
    `--load-extension=${extPath}`
  ],
  viewport: { width: 1400, height: 900 }
});

try {
  let [sw] = context.serviceWorkers();
  if (!sw) {
    sw = await context.waitForEvent('serviceworker', { timeout: 15000 });
  }
  const extensionId = new URL(sw.url()).host;
  console.log('extensionId=', extensionId);

  const page = context.pages()[0] ?? await context.newPage();
  await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2200);

  await page.click('body', { button: 'right' });
  await page.waitForSelector('#claude-web-modifier-inline-root', { timeout: 20000 });

  await page.selectOption('.cwm-inline-theme-tone', 'dynamic');
  await page.waitForTimeout(300);
  const themeOptions = await page.$$eval('.cwm-inline-theme-select option', (opts) =>
    opts.map((o) => ({ value: o.value, text: o.textContent || '' }))
  );
  const target = themeOptions.find((o) => /动态/.test(o.text)) || themeOptions[0];
  if (target?.value) {
    await page.selectOption('.cwm-inline-theme-select', target.value);
  }

  await page.click('.cwm-inline-theme-save');
  await page.waitForTimeout(2500);

  const sample1 = await page.evaluate(() => {
    const b = getComputedStyle(document.documentElement, '::before');
    const a = getComputedStyle(document.documentElement, '::after');
    return {
      before: {
        animationName: b.animationName,
        animationDuration: b.animationDuration,
        opacity: b.opacity,
        transform: b.transform,
        bgPos: b.backgroundPosition
      },
      after: {
        animationName: a.animationName,
        animationDuration: a.animationDuration,
        opacity: a.opacity,
        transform: a.transform,
        bgPos: a.backgroundPosition
      }
    };
  });

  await page.waitForTimeout(1600);

  const sample2 = await page.evaluate(() => {
    const b = getComputedStyle(document.documentElement, '::before');
    const a = getComputedStyle(document.documentElement, '::after');
    return {
      before: {
        animationName: b.animationName,
        opacity: b.opacity,
        transform: b.transform,
        bgPos: b.backgroundPosition
      },
      after: {
        animationName: a.animationName,
        opacity: a.opacity,
        transform: a.transform,
        bgPos: a.backgroundPosition
      }
    };
  });

  const outPath = path.resolve('C:/Users/21604/Desktop/谷歌 (2)/logs/playwright-dynamic-google.png');
  await page.screenshot({ path: outPath, fullPage: false });

  console.log('sample1=', JSON.stringify(sample1));
  console.log('sample2=', JSON.stringify(sample2));
  console.log('screenshot=', outPath);

  const changed =
    sample1.before.transform !== sample2.before.transform ||
    sample1.before.bgPos !== sample2.before.bgPos ||
    sample1.after.transform !== sample2.after.transform ||
    sample1.after.bgPos !== sample2.after.bgPos;
  console.log('dynamicChanged=', changed);
} finally {
  await context.close();
}
