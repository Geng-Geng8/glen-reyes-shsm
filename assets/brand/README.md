# Supplied brand artwork

| Website asset | Supplied original | Treatment and placement |
| --- | --- | --- |
| `gr-mark.svg` | `GR Logo 3.png` | Original artwork embedded in a small SVG wrapper; its luminance forms the mask and the site's Electric Cyan (`#38BDF8`) supplies the colour. Used in the header, footer and Meet Glen nameplate. |
| `../favicon.svg` | `GR Logo 3.png` | The same cyan mark, on a Midnight Indigo (`#15103D`) rounded square. |
| `shsm-logo.webp` | `Colour_SHSM.jpg` | Original SHSM colours and full artwork retained; resized to 600 × 247. Links to Ontario's SHSM program information beneath the workshop details. |

The GR shape is the supplied artwork, not an approximation or generated redesign.
Its original white margin is excluded by the SVG viewBox; white pixels become
transparent through a luminance filter. A lossless grayscale copy of the embedded
bitmap reduces file size without changing the shape. These are self-contained SVG
wrappers around raster artwork, not traced vector paths.

The GR images have empty alternative text where adjacent text already identifies
Glen. The SHSM link has descriptive alternative text and an accessible new-tab
notice. Both logos preserve their proportions. Supporting marks load lazily;
header branding loads normally. No external image service or dependency is used.
