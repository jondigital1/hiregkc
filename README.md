# hiregkc.com

Redesigned website for GKC Enterprises LLC (Horsham, PA): landscaping, hardscaping, snow removal and bulk material delivery for Montgomery and Bucks Counties.

Plain static HTML/CSS/JS, no build step. Recreated faithfully from the design handoff (`HireGKC website redesign review.zip`). Deployed on Vercel (project `hiregkc`).

## Pages

| File | URL | Notes |
|---|---|---|
| `index.html` | `/` | Hero, trust bar, four service doors, Meet Gary strip, reviews, estimate form |
| `landscaping.html` | `/landscaping` | Service tiles, 12-photo gallery, before/after slots |
| `hardscaping.html` | `/hardscaping` | Browse-by-space gallery, transformations, 4-step process |
| `snow-removal.html` | `/snow-removal` | 24-hour line card, storm timeline, fleet strip, three plans |
| `delivery-services.html` | `/delivery-services` | Product lists, live yardage calculator, delivery request form |
| `about.html` | `/about` | The family story, Gary's pricing quote, crew and fleet photos |
| `contact.html` | `/contact` | Full estimate form with service/budget/timeline chips |

`vercel.json` sets clean URLs (so `/landscaping` serves `landscaping.html`) and 301s the old `/testimonials` to `/#reviews`.

## Pitch mode (current state)

Gary has not signed off on running this site yet, so the deployment is in pitch mode:

- **Search engines are blocked** via an `X-Robots-Tag: noindex` header in `vercel.json`. When Gary approves and the domain cuts over, delete that header block; the SEO layer (FAQs, schema, sitemap) is already in place and takes effect then.
- **Forms are intentionally not wired** (`FORM_ENDPOINT` empty); they validate and show a call/email fallback, which is correct demo behavior.

## Configuration (js/site.js)

- `FORM_ENDPOINT`: **empty until connected.** Set it to a form backend (e.g. a Formspree form ID) that emails gary@hiregkc.com and brandi@hiregkc.com. Until then, submitting shows a call/email fallback instead of pretending to send.
- `WINTER_MODE`: set `true` from November to March to show the sitewide 24-hour snow banner.

## SEO layer (added after the handoff)

Each service page carries a local-expertise block, a short house-rule note, and an FAQ section (with FAQPage and Service structured data), plus `sitemap.xml` and `robots.txt`. The org schema lists `alternateName: "HireGKC"` so the domain brand matches searches. **The FAQ answers and Gary quotes are drafted in the house voice and need Gary's sign-off before launch**, especially anything touching repairs, timelines or response promises.

## Client direction (2026-08-29)

- **Gary and family are not featured.** The owner does not want to be front and center: no photos of him or the family, no attributed quotes, no "Meet Gary" framing. He appears only in the contact email addresses. The family photo (`gary-family.webp`) was deleted from the tree (it still exists in git history; scrub history if that matters).
- **Palette retokenized to the actual GKC logo**: royal blue `#2337A8`, deep navy `#10194A`, black ink, cool white ground. The old spruce green and equipment orange are gone. Service wayfinding colors are now blue-family shades.

## Still waiting on Gary (from the handoff)

1. PA HIC registration number (display on `/about`)
2. Real Google/Facebook aggregate rating and review counts (trust bar shows stars without a number until verified)
3. Photo day: portrait with truck, crew, fleet, 15 best projects, 5 before/after pairs (dashed slots on `/landscaping` and `/hardscaping` are waiting for these)
4. Delivery prices per yard/ton and delivery fee rules
5. Snow contract structures and the response promise he'll print
6. Business hours, confirmed town list, manufacturer certifications
7. Approval of the pricing quote in his own words

## Images

All photos in `/images` are real GKC jobs, re-hosted from the current site's Squarespace CDN, plus two photos supplied in the handoff (`crew-on-the-job.webp`, `fleet-plow-trucks.webp`). No stock photography, ever.

House copy rules: brand is "GKC Enterprises" (never "Enterprise"), no em dashes, price is discussed only through the GKC promise quote.
