# Review verification

Tested locally in headless Microsoft Edge 155 (Chromium), using the dependency-free preview server and the real `/glen-reyes-shsm/` path. The visual-storytelling update passes 75 browser checks. Screenshots and temporary machine-readable results are under ignored `tmp/qa/`.

## Automated browser coverage

- Viewports: 320, 375, 390, 430, 650, 768, 900, 1024, and 1440 pixels; no document-level horizontal overflow.
- Fragment targets, unique IDs, all ten existing main sections, form labels, page title, local font loading, and all six default-state photographs. Responsive image sources, explicit image dimensions, hero fetch priority and lazy loading of supporting photographs are checked.
- Five sector choices, four distinct sector photographs with captions, ICT link to the existing Goal Quest resource, recommendations, form preselection, experience detail expansion, certification multi-select, and bundle limit.
- Four project journey stages with optional play/pause, five explicitly labeled Goal Quest placeholders, and keyboard-controlled FAQ.
- Required-field and email validation; draft content, encoding, editing, and honest email-only status.
- Mocked configured form responses: confirmed success, HTTP 500, invalid JSON, and network failure. Details remain available after failures. No inquiry was sent to an external service.
- Mobile menu open/close, navigation, Escape and focus return, reduced-motion behavior, and scroll reveals.
- JavaScript-disabled reading, navigation, and mobile overflow.
- Optional axe-core 4.10.3 WCAG A/AA rules (through WCAG 2.2); automated findings are fixed before completion. This is not a full manual accessibility certification.
- JavaScript syntax and Git whitespace checks.

## Visual review

Reviewed 45 photo compositions: all nine source photographs at 375, 390, 430, 768 and 1440 pixels. The review covers the hero, certification and ICE cards, Summer Battle DJ image, all four photographed sector states, and hosting image. Screenshots and rendered-image metrics are in `tmp/qa/story/`. All states load and have no horizontal overflow. Faces, the raised hand/microphone, DJ equipment and breaking movement remain visible. The singer receives a taller mobile crop; the hero, learning photos, DJ portrait and wide hosting scene preserve their compositions. Captions sit outside images.

Also reviewed the desktop hero, offering cards, Show & Prove integration and Meet Glen layout, plus mobile cards and Meet Glen. Nine sources have optimized, self-hosted WebP variants, with six photos visible in the default state. Fonts and images are local; no third-party runtime requests are needed in default email mode. Goal Quest imagery stays visibly marked as pending. No new main sections, galleries, autoplay media or runtime dependencies were introduced.

ICE image follow-up: replaced the repeated table activity with the full-group
photograph (`IMG_3314.HEIC`). Verified loading and no horizontal overflow at 375,
390, 430, 768 and 1440 px; reviewed mobile/desktop crops and confirmed that the ICE
details link and inquiry preselection still work. Follow-up screenshots are
`tmp/qa/ice-group-*.png`.

Latest offering update: Certifications now uses a tight crop of
`YorkBoard-SHSM-20250307_141554.jpg`, focused on the presenters and projected slide.
ICE now uses `IMG_9425.JPG` (Glen in a hat with students standing). Both photos load
without overflow at 375, 390, 430, 768 and 1440 px, and both offering links still
prefill the inquiry correctly. Reviewed desktop/mobile captures in
`tmp/qa/certification-updated-*.png` and `tmp/qa/ice-updated-*.png`.

## Not verified

- Live form delivery: no endpoint/account is configured. Real delivery needs an approved test after account setup.
- Goal Quest app link, real screens, and companion animation: missing assets and verified public address.
- Physical iPhone/Safari, Android/Chrome, screen readers, and actual school network/device restrictions.
- Lighthouse/Core Web Vitals scores under field conditions; no score or performance guarantee is claimed.
- Production GitHub Pages behavior: not deployed. Local path compatibility is tested.
- Publication rights, photographer licenses and participant releases for the supplied images: not provided or verified. See `assets/photos/README.md` before any approved release.

## Re-run

Start `node tools/preview.mjs`. If Playwright and Microsoft Edge are available, run `node tools/qa.mjs`, or pass the absolute path to an existing Playwright package as the first argument. No test package is needed to use or host the website. If `tmp/axe.min.js` is present, the optional accessibility audit also runs; it is temporary tooling, not shipped website code.
