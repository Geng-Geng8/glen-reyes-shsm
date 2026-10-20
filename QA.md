# Review verification

Tested locally in headless Microsoft Edge 155 (Chromium), using the dependency-free preview server and the real `/glen-reyes-shsm/` path. The final suite contains 65 browser checks. Screenshots and temporary machine-readable results are under ignored `tmp/qa/`.

## Automated browser coverage

- Viewports: 320, 390, 650, 768, 900, 1024, and 1440 pixels; no document-level horizontal overflow.
- Fragment targets, unique IDs, semantic main sections, form labels, page title, local font loading, and actual workshop photo loading.
- Five sector choices, recommendations, form preselection, experience detail expansion, certification multi-select, and bundle limit.
- Four project journey stages with optional play/pause, five explicitly labeled Goal Quest placeholders, and keyboard-controlled FAQ.
- Required-field and email validation; draft content, encoding, editing, and honest email-only status.
- Mocked configured form responses: confirmed success, HTTP 500, invalid JSON, and network failure. Details remain available after failures. No inquiry was sent to an external service.
- Mobile menu open/close, navigation, Escape and focus return, reduced-motion behavior, and scroll reveals.
- JavaScript-disabled reading, navigation, and mobile overflow.
- Optional axe-core 4.10.3 WCAG A/AA rules (through WCAG 2.2); automated findings are fixed before completion. This is not a full manual accessibility certification.
- JavaScript syntax and Git whitespace checks.

## Visual review

Reviewed desktop hero, full page, actual workshop photo and facilitator section, mobile hero, and mobile form. Fixed the desktop hamburger visibility and mobile tagline spacing. Fonts and workshop photo are local; no third-party runtime requests are needed in the default email mode. App imagery stays visibly marked as pending.

## Not verified

- Live form delivery: no endpoint/account is configured. Real delivery needs an approved test after account setup.
- Goal Quest app link, real screens, and companion animation: missing assets and verified public address.
- Physical iPhone/Safari, Android/Chrome, screen readers, and actual school network/device restrictions.
- Lighthouse/Core Web Vitals scores under field conditions; no score or performance guarantee is claimed.
- Production GitHub Pages behavior: not deployed. Local path compatibility is tested.

## Re-run

Start `node tools/preview.mjs`. If Playwright and Microsoft Edge are available, run `node tools/qa.mjs`, or pass the absolute path to an existing Playwright package as the first argument. No test package is needed to use or host the website. If `tmp/axe.min.js` is present, the optional accessibility audit also runs; it is temporary tooling, not shipped website code.
