import { chromium } from 'playwright';
import path from 'node:path';

const extPath = path.resolve('C:/Users/21604/Desktop/谷歌 (2)/谷歌/extension');
const context = await chromium.launchPersistentContext(path.resolve('C:/Users/21604/Desktop/谷歌 (2)/tmp-pw-profile2'), {
  headless: false,
  args: [`--disable-extensions-except=${extPath}`, `--load-extension=${extPath}`],
  viewport: { width: 1280, height: 800 }
});
try {
  const page = context.pages()[0] ?? await context.newPage();
  await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
  await page.click('body', { button: 'right' });
  await page.waitForSelector('#claude-web-modifier-inline-root');
  await page.selectOption('.cwm-inline-theme-tone','dynamic');
  const opts = await page.$$eval('.cwm-inline-theme-select option', os => os.map(o=>({v:o.value,t:o.textContent||''})));
  const v = opts.find(o=>/动态/.test(o.t))?.v || opts[0]?.v;
  if(v) await page.selectOption('.cwm-inline-theme-select', v);
  await page.click('.cwm-inline-theme-save');
  await page.waitForTimeout(3000);
  const info = await page.evaluate(() => {
    const b = getComputedStyle(document.documentElement,'::before');
    const a = getComputedStyle(document.documentElement,'::after');
    return {
      reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
      before: {
        name:b.animationName, duration:b.animationDuration, state:b.animationPlayState,
        timing:b.animationTimingFunction, iter:b.animationIterationCount,
        transform:b.transform
      },
      after: {
        name:a.animationName, duration:a.animationDuration, state:a.animationPlayState,
        timing:a.animationTimingFunction, iter:a.animationIterationCount,
        transform:a.transform
      }
    };
  });
  console.log(JSON.stringify(info));
} finally { await context.close(); }
