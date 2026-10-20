# Glen Reyes SHSM

A one-page marketing website for Glen Reyes Education: hands-on SHSM certifications, custom bundles, ICE experiences, and Vibe Coding for Ontario schools.

**Review branch:** `feature/shsm-landing-page-v1`
**Repository:** `Geng-Geng8/glen-reyes-shsm`
**Future Pages URL:** <https://geng-geng8.github.io/glen-reyes-shsm/>
**Status:** built for local review. No merge or production deployment has been performed.

## Preview

From this folder, run:

```powershell
node tools/preview.mjs
```

Open <http://127.0.0.1:4173/glen-reyes-shsm/>. Keep the terminal running; press Ctrl+C to stop. The server binds only to your computer and simulates the actual GitHub Pages path. If the port is occupied, set `$env:SHSM_PREVIEW_PORT = '4174'` before running it.

You can also open `index.html` directly. There is no mandatory build, package install, database, or server runtime for hosting.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All nine page sections, navigation, form, FAQ, and SEO metadata |
| `styles.css` | Responsive layout, local fonts, motion, and reduced-motion settings |
| `script.js` | Workshop bundle, sector choices, project journey, app preview, and form handling |
| `config.js` | Public form endpoint, app URL, and screenshot paths |
| `assets/` | Optimized workshop photo, favicon, social card, fonts, and font licenses |
| `tools/preview.mjs` | Optional dependency-free local preview server |
| `tools/qa.mjs` | Optional automated browser checks; not loaded by the website |
| `QA.md` | Verification scope, results, and remaining checks |

## Inquiry form: current email fallback

No submission service is configured. The form validates the required fields and prepares an email draft. Teachers then choose **Open email draft** or **Copy inquiry**, and send the message themselves to **glen@h4ml.com**. The page explicitly says that nothing has been sent. It never treats opening an email app as delivery confirmation.

The draft stays editable and includes selected sector, experience, certifications, and optional workshop details. The page does not save contact information in browser storage or add analytics.

### Enable direct submission (optional)

1. Create a form-service account, for example [Formspree](https://formspree.io/). A [free tier is listed](https://formspree.io/plans); confirm current limits and suitability before using it. No paid plan is required by this code.
2. Create a form and verify **glen@h4ml.com** as its destination. Review that account's access, retention, notifications, spam settings, and permitted site domain.
3. Copy the public form endpoint (normally `https://formspree.io/f/YOUR_FORM_ID`). In `config.js`, set `formEndpoint` to that URL. Leave the other configuration fields in place. The form ID is public; never insert private account credentials or API keys.
4. Confirm AJAX cross-origin requests are supported. This implementation sends `FormData` with `Accept: application/json` and requires an HTTP success response with JSON `{ "ok": true }`. A different service needs a matching acknowledgement adapter in `script.js`. It does not use `no-cors` or treat an opaque response as success. See [Formspree's AJAX documentation](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/).
5. With permission, send one clearly labeled test inquiry from the review site. Check both the service dashboard and Glen's inbox. Also check a failed request and any CAPTCHA flow enabled in the provider account. Browser tests here mock the transport; actual delivery has **not** been tested.
6. Once actual delivery is confirmed, the page uses **Request my custom SHSM quote** and shows a service-confirmed receipt. Errors and timeouts preserve the details and offer an email draft. A timeout may mean the provider received the request without returning confirmation; the message warns against an uncertain retry.

Set `formEndpoint` back to `''` at any time to return to email-only inquiries. Without JavaScript, the page provides a direct email link and an explanatory notice.

## Goal Quest assets still needed

No real app screenshots, companion artwork, or verified public app URL were present in this repository or its SHSM reference folder. The five interactive preview panels are explicitly labeled **asset placeholders, not the app UI**. The hero's plan and portfolio are illustrative examples, not product screenshots or actual student results. The Goal Quest CTA currently opens an email to ask Glen for access.

Provide these exact screenshot files (WebP preferred; PNG also supported if the configuration matches):

```text
assets/goal-quest/goal-selection.webp
assets/goal-quest/goal-creation.webp
assets/goal-quest/action-tracking.webp
assets/goal-quest/companion-gallery.webp
assets/goal-quest/ai-coaching.webp
```

Use screenshots with no student names, email addresses, or private records. Around 960px wide is enough; preserve the real aspect ratio and aim for less than 200KB per image. Add their relative paths to `goalQuestScreenshots.selection`, `.creation`, `.tracking`, `.companions`, and `.coaching` in `config.js`. The interface then renders actual images; unavailable images fall back to a labeled placeholder.

Set `goalQuestUrl` to the verified HTTPS public app address. This changes the CTA to that address. The separate H4 Goal Quest repository was not opened or modified. A higher-resolution facilitator portrait can be added later; the current page uses an authentic workshop photo and a Glen Reyes nameplate.

## Content and asset sources

- Supplied project brief: services, philosophy, priority sectors, business contact, and named digital projects. No testimonials, fixed prices, or guaranteed eligibility have been added.
- Local `2025-SHSM Training Programs - H4 Community - Breaking Canada.pdf`: verified historical workshop topics, H4 school programming, and Glen's education and sport experience. Historical prices and dated title/achievement claims were not republished.
- Local `SHSM at Madonna.jpg`: resized to `assets/workshop.webp` (1200 × 900). No stock or generated student/facilitator photo is used.
- [Ontario SHSM overview](https://www.ontario.ca/page/specialist-high-skills-major), [Non-Profit, Education and Child Care guide](https://www.ontario.ca/document/specialist-high-skills-major-shsm-policy-and-implementation-guide/non-profit-education-and), and [Ontario SPE guidance](https://www.ontario.ca/document/specialist-high-skills-major-shsm-policy-and-implementation-guide/sector-partnered). Direct fetches of the first two pages returned 403; indexed official material and the official SPE page were accessible. The copy distinguishes certifications, ICE, and coding. SPEs are described as approximately six hours, co-designed and co-delivered with teachers, with final student self-assessment. Recognition and sector requirements are confirmed with the school.
- Space Grotesk and Inter: self-hosted Latin WOFF2 subsets from Google Fonts, with SIL Open Font License files in `assets/fonts/`.
- Favicon, project artifacts, and social card: made for this site. No app interface is fabricated.

## Review and eventual GitHub Pages deployment

1. Review desktop and mobile, check the copy, choose whether to configure direct submissions, and replace the Goal Quest placeholders when assets are ready.
2. Review the feature branch diff. A commit or push on this branch does not publish the site.
3. **Only after Glen approves:** merge the feature branch to `main`, then enable GitHub Pages under repository Settings → Pages → Deploy from a branch → `main` → `/ (root)`. Do not select the feature branch for deployment during review.
4. Verify the resulting `/glen-reyes-shsm/` URL, assets, mobile layout, app link, and a real approved form submission. SEO canonical/Open Graph URLs already use that future address.

All local asset URLs are relative. There are no framework routes or hardcoded root asset paths. To roll back after an approved release, revert the landing-page commit through a review branch and republish the previous main version.
