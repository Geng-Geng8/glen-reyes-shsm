// Optional browser QA. The website itself has no dependencies.
// Usage: node tools/qa.mjs [path-to-playwright-package]
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2] || 'playwright');
const base = process.env.SHSM_PREVIEW_URL || 'http://127.0.0.1:4173/glen-reyes-shsm/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const checks = [];
const check = (name, value) => { assert.ok(value, name); checks.push(name); };
await fs.mkdir('tmp/qa', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  const errors = [];
  const failures = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  check('Correct page title', (await page.title()).includes('Glen Reyes SHSM'));
  check('Local fonts loaded', await page.evaluate(() => document.fonts.check('700 24px "Space Grotesk"') && document.fonts.check('400 16px "Inter"')));
  check('One H1 and ten existing main sections', await page.locator('h1').count() === 1 && await page.locator('main>section').count() === 10);
  check('Every fragment link has a target', await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].every((a) => document.getElementById(a.hash.slice(1)))));
  check('No duplicate IDs', await page.evaluate(() => {const ids=[...document.querySelectorAll('[id]')].map((el)=>el.id);return ids.length===new Set(ids).size;}));
  check('All form inputs have labels', await page.evaluate(() => [...document.querySelectorAll('input,select,textarea')].every((el) => el.labels.length > 0)));
  await page.screenshot({ path: 'tmp/qa/desktop-hero.png' });
  for (const width of [1440, 1024, 900, 768, 650, 430, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    check(`No horizontal overflow at ${width}px`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width === 390) await page.screenshot({ path: 'tmp/qa/mobile-hero.png' });
  }
  await page.setViewportSize({ width: 1440, height: 1050 });
  check('Desktop hides the mobile menu button', !await page.locator('.menu-toggle').isVisible());
  await page.locator('#glen img').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => { const img = document.querySelector('#glen img'); return img.complete && img.naturalWidth > 0; });
  check('Facilitator portrait loads', await page.locator('#glen img').evaluate((img) => img.naturalWidth > 0));
  for (const photo of await page.locator('main img').all()) {
    await photo.scrollIntoViewIfNeeded();
    await photo.evaluate((img) => img.decode());
  }
  check('All six visible storytelling photos load with responsive sources', await page.locator('main img').evaluateAll((images) => images.length === 6 && images.every((img) => img.naturalWidth > 0 && img.srcset && img.width > 0 && img.height > 0)));
  check('Hero photo is prioritized and supporting photos load lazily', await page.locator('main img').evaluateAll((images) => images[0].fetchPriority === 'high' && images.slice(1).every((img) => img.loading === 'lazy')));
  await page.locator('#glen').screenshot({ path: 'tmp/qa/meet-glen.png' });
  await page.locator('#home').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'tmp/qa/desktop-full.png', fullPage: true });
  const sectorPhotoSources = new Set();
  for (const sector of ['sports', 'arts', 'business', 'ict', 'nonprofit']) {
    await page.locator(`[data-sector="${sector}"]`).click();
    check(`Sector ${sector} updates and prefills inquiry`, await page.locator('#sector').inputValue() === sector && await page.locator(`[data-sector="${sector}"]`).getAttribute('aria-pressed') === 'true');
    if (sector === 'ict') {
      check('ICT links to the existing Goal Quest resource without unrelated photography', !await page.locator('#sector-photo').isVisible() && await page.locator('#sector-tool-note').isVisible());
    } else {
      await page.locator('#sector-photo img').evaluate((image) => image.decode());
      check(`Sector ${sector} has a loaded photograph and factual caption`, await page.locator('#sector-photo img').evaluate((image) => image.naturalWidth > 0 && image.alt.length > 15) && (await page.locator('#sector-photo figcaption').innerText()).length > 15);
      sectorPhotoSources.add(await page.locator('#sector-photo img').getAttribute('src'));
    }
  }
  check('Each photographed sector uses a different source', sectorPhotoSources.size === 4);
  await page.locator('[data-sector="ict"]').focus();
  await page.keyboard.press('Enter');
  check('Sector controls support keyboard activation', await page.locator('#sector').inputValue() === 'ict');
  await page.locator('.certification-card .card-link').click();
  check('Certification experience prefills inquiry', await page.locator('#experience').inputValue() === 'certifications');
  for (const experience of ['ice', 'coding']) {
    await page.locator(`[data-detail="${experience}"]`).click();
    check(`${experience} details and inquiry preselection`, await page.locator(`#${experience}-details`).getAttribute('open') !== null && await page.locator('#experience').inputValue() === experience);
  }
  for (const topic of ['Project Management: YOU', 'Leadership Skills', 'Portfolio Development']) await page.locator(`[data-topic="${topic}"]`).click();
  await page.locator('[data-topic="Customer Service"]').click();
  check('Bundle limits the builder to three topics', await page.locator('.topic-choice[aria-pressed=true]').count() === 3);
  check('Bundle transfers topics and bundle size', await page.locator('input[name=certifications]:checked').count() === 3 && await page.locator('#bundle-size').inputValue() === '3');
  for (const stage of ['plan', 'action', 'proof', 'idea']) {
    await page.locator(`[data-stage="${stage}"]`).click();
    check(`Journey stage ${stage} updates`, await page.locator('#journey-art').getAttribute('class').then((value) => value.includes(`${stage}-art`)));
  }
  await page.locator('#journey-play').click();
  check('Story playback can start', await page.locator('#journey-play').getAttribute('aria-pressed') === 'true');
  await page.locator('#journey-play').click();
  check('Story playback can pause', await page.locator('#journey-play').getAttribute('aria-pressed') === 'false');
  for (const screen of ['selection', 'creation', 'tracking', 'companions', 'coaching']) {
    await page.locator(`[data-screen="${screen}"]`).click();
    check(`Goal Quest ${screen} is an honest placeholder`, await page.locator('#quest-screen').innerText().then((text) => text.includes('NOT THE APP UI')));
  }
  const faq = page.locator('.faq-list details').first();
  await faq.locator('summary').focus();
  await page.keyboard.press('Enter');
  check('FAQ works from keyboard', await faq.getAttribute('open') !== null);
  await page.locator('#submit-inquiry').click();
  check('Required fields block incomplete inquiry', await page.locator('#teacher-name').evaluate((input) => !input.validity.valid));
  await page.locator('#teacher-name').fill('Test Teacher');
  await page.locator('#school').fill('Example Secondary / Test Board');
  await page.locator('#email').fill('invalid-email');
  check('Email validation rejects invalid address', await page.locator('#email').evaluate((input) => !input.validity.valid));
  await page.locator('#email').fill('teacher@example.test');
  await page.locator('#experience').selectOption('certifications');
  await page.locator('#submit-inquiry').click();
  check('Email fallback never claims sent', (await page.locator('#form-status').innerText()).includes('Nothing has been sent'));
  check('Draft includes sector and selected certifications', (await page.locator('#email-draft').inputValue()).includes('Information and Communications Technology') && (await page.locator('#email-draft').inputValue()).includes('Portfolio Development'));
  check('Email link includes encoded draft', (await page.locator('#open-email').getAttribute('href')).startsWith('mailto:glen%40h4ml.com?subject='));
  await page.locator('#school').fill('Updated School');
  check('Prepared draft stays in sync with edits', (await page.locator('#email-draft').inputValue()).includes('Updated School'));
  check('Reduced motion disables animation', await page.locator('.reveal').first().evaluate((el) => getComputedStyle(el).transitionDuration === '0s'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#inquiry-form').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'tmp/qa/mobile-inquiry.png' });
  await page.locator('.menu-toggle').click();
  check('Mobile menu opens', await page.locator('#main-nav').isVisible());
  await page.keyboard.press('Escape');
  check('Escape closes menu and returns focus', !await page.locator('#main-nav').isVisible() && await page.locator('.menu-toggle').evaluate((el) => el === document.activeElement));
  await page.locator('.menu-toggle').click();
  await page.locator('#main-nav a[href="#sectors"]').click();
  check('Mobile navigation closes after selection', !await page.locator('#main-nav').isVisible());
  check('No page JavaScript errors', errors.length === 0);
  check('No failed local asset requests', failures.length === 0);
  let accessibility = 'Not run (optional tmp/axe.min.js unavailable)';
  try {
    await fs.access('tmp/axe.min.js');
    await page.addScriptTag({ path: 'tmp/axe.min.js' });
    accessibility = [];
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const audit = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
      accessibility.push(...audit.violations.map(({ id, impact, nodes }) => ({ width, id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })));
    }
    await fs.writeFile('tmp/qa/accessibility.json', JSON.stringify(accessibility, null, 2));
    check('Axe WCAG A/AA audit has no detected violations', accessibility.length === 0);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  // Mocked transport only: no inquiries are sent to any external service.
  for (const outcome of ['success', 'server-error', 'invalid-json', 'network-error']) {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const mock = await context.newPage();
    await mock.route('**/config.js', (route) => route.fulfill({ contentType: 'text/javascript', body: 'window.SHSM_CONFIG={formEndpoint:"https://forms.example.test/inquiry",contactEmail:"glen@h4ml.com"};' }));
    await mock.route('https://forms.example.test/inquiry', async (route) => {
      if (outcome === 'network-error') return route.abort();
      await route.fulfill({ status: outcome === 'server-error' ? 500 : 200, contentType: 'application/json', body: outcome === 'invalid-json' ? '<html>not a confirmation</html>' : JSON.stringify({ ok: outcome === 'success' }) });
    });
    await mock.goto(base);
    await mock.locator('#teacher-name').fill('Test Teacher');
    await mock.locator('#school').fill('Test School');
    await mock.locator('#email').fill('teacher@example.test');
    await mock.locator('#sector').selectOption('arts');
    await mock.locator('#experience').selectOption('ice');
    await mock.locator('#submit-inquiry').click();
    await mock.waitForFunction(() => document.querySelector('#form-status').dataset.state !== 'info');
    check(`Configured endpoint ${outcome} handled honestly`, await mock.locator('#form-status').getAttribute('data-state') === (outcome === 'success' ? 'success' : 'error'));
    check(`Form preserves details after ${outcome}`, await mock.locator('#teacher-name').inputValue() === 'Test Teacher');
    if (outcome !== 'success') check(`${outcome} offers email fallback`, await mock.locator('#email-fallback').isVisible());
    await context.close();
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJS.newPage();
  await staticPage.goto(base);
  check('No-JavaScript navigation and content remain available', await staticPage.locator('#main-nav').isVisible() && await staticPage.locator('h1').isVisible());
  check('No-JavaScript mobile has no overflow', await staticPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await noJS.close();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(base);
  await page.locator('#show-prove .section-heading').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#show-prove .section-heading')).opacity === '1');
  check('Scroll reveal enhances visible sections', await page.locator('#show-prove .section-heading').evaluate((el) => getComputedStyle(el).opacity === '1'));
  const summary = { checks: checks.length, results: checks, browser: await browser.version(), errors, failures, accessibility, externalSubmissions: 0 };
  await fs.writeFile('tmp/qa/results.json', JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally { await browser.close(); }
