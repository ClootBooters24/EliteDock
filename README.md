# EliteDock

Scaffolded static marketing site for elitedock.com, prepared for iterative content and design work.

## Current Scaffold

- Semantic homepage sections with anchor navigation:
	- Hero
	- Services
	- Projects
	- Process
	- About
	- FAQ
	- Contact
- Mobile-ready header/navigation behavior in JavaScript
- Reusable CSS token system and layout utilities
- Placeholder content blocks ready for copywriting and design updates
- Cloudflare Pages-compatible static structure in src

## File Map

- src/index.html: Site structure and content placeholders
- src/css/index.css: Base tokens, layout, section and component scaffolding
- src/css/header.css: Header and responsive nav styles
- src/css/footer.css: Footer styles
- src/js/index.js: Menu toggle, active nav highlighting, and placeholder form handling

## Team Workflow Suggestion

1. Replace placeholder copy in src/index.html with final messaging.
2. Keep class names stable so design work can proceed independently.
3. Update token values in src/css/index.css (:root) for final color and spacing system.
4. Swap placeholder media with optimized image/video assets.
5. Connect contact form submit handler in src/js/index.js to a backend endpoint or Cloudflare Worker.

## Cloudflare Notes (KV and R2)

- wrangler.json already includes kv_namespaces and r2_buckets stubs.
- Set each binding and id or bucket_name value before wiring runtime usage.
- Static-only pages can ship now; dynamic workflows can be added later via Worker routes.

## Recommended Next Build Steps

1. Add final favicon and social preview assets under src/assets.
2. Add a projects data source (JSON in KV or static file) and render cards from JS.
3. Implement a contact-request endpoint with Cloudflare Worker + KV logging.
4. Store larger media and brochures in R2 and link them in project sections.

