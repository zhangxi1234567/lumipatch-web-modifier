import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const extPath = path.resolve('C:/Users/21604/Desktop/谷歌 (2)/谷歌/extension');
const outDir = path.resolve('C:/Users/21604/Desktop/谷歌 (2)/logs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const context = await chromium.launchPersistentContext(path.resolve('C:/Users/21604/Desktop/谷歌 (2)/tmp-pw-profile3'), {
  headless: false,
  args: [`--disable-extensions-except=${extPath}`, `--load-extension=${extPath}`],
  viewport: { width: 1365, height: 768 }
});
try {
  const page = context.pages()[0] ?? await context.newPage();
  await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
  await page.click('body', { button: 'right' });
  await page.waitForSelector('#claude-web-modifier-inline-root');
  await page.selectOption('.cwm-inline-theme-tone','dynamic');
  const opts = await page.$$eval('.cwm-inline-theme-select option', os => os.map(o=>({v:o.value,t:o.textContent||''})));
  const v = opts.find(o=>o.t.includes('海流微澜'))?.v || opts.find(o=>/动态/.test(o.t))?.v || opts[0]?.v;
  if(v) await page.selectOption('.cwm-inline-theme-select', v);
  await page.click('.cwm-inline-theme-save');
  await page.waitForTimeout(2500);

  // capture left area where dynamic bg should be visible
  const clip = { x: 0, y: 0, width: 620, height: 700 };
  const p1 = path.join(outDir, 'dynamic-proof-1.png');
  const p2 = path.join(outDir, 'dynamic-proof-2.png');
  await page.screenshot({ path: p1, clip });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: p2, clip });

  console.log('saved', p1, p2);
} finally {
  await context.close();
}
