# YASH TECH CCTV — redesign prototype

A responsive, multi-page static website concept for YASH TECH CCTV, using a futuristic smart-security visual direction.

## Pages
- `index.html` — homepage
- `products.html` — product categories
- `services.html` — installation and services
- `solutions.html` — property-specific solution entry points
- `projects.html` — gallery placeholder (no invented projects)
- `about.html` — business profile
- `contact.html` — contact details and WhatsApp enquiry form

## Run locally
Open `index.html` in a browser, or serve this folder with any static web server.

## WhatsApp
The demo uses the phone number listed on the existing About page: `+91 93858 98667` (WhatsApp URL country-code format `919385898667`). Confirm this number is registered on WhatsApp and approved by the business owner before launch.

## Before publishing
1. Confirm the phone/WhatsApp number, email, address, business hours and service area.
2. Replace illustrative CSS camera artwork with owner-approved product photography if available.
3. Add only genuine, approved installation photos to the gallery.
4. Inspect the live site's current platform, hosting, URL paths, metadata and redirects. The platform could not be verified from the public page fetch.
5. Back up the live website and obtain hosting/domain access before replacing anything.
6. Test all links, WhatsApp flows, form validation, mobile navigation and accessibility.
7. Confirm the correct domain and deployment setup with the current site administrator.

This is a static prototype. The contact form opens WhatsApp; it does not save submissions to a database. Product stock, prices, brands, warranties, service promises and customer projects are intentionally not invented.


## Existing website content migration
The `products.html` page now includes 23 catalogue entries recovered from the HTTrack public-site archive, with their corresponding product images copied into `assets/catalog/`. Catalogue names are from the archived public page; availability and prices are not verified. The category filters are client-side and the WhatsApp links prefill the selected product name.

Other existing public-site content identified in the archive includes the About, Services, Photos/Clients, Reviews and Videos pages. Review authenticity and permission to republish client names/photos should be confirmed before importing testimonials or logos.


## Homepage refresh (v2)
The homepage now uses actual recovered YASH TECH product photographs in a product-led hero and a four-item featured catalogue. The CSS-drawn camera illustration has been removed. Product enquiries open WhatsApp; confirm the recipient number and product availability before public launch.


## Homepage v3 refinements
- Added the original `images/logo.png` recovered from the old website archive.
- Replaced the temporary YT lettermark with the actual YASH TECH logo across all pages.
- Improved hero product image presentation using a clean product-photo panel to prevent the white-background image from visually overwhelming the hero.
- Added a link to the official Instagram Reels profile for real product demonstrations and installation content.


## V4 premium redesign and dynamic catalogue
- Premium dark security aesthetic with lime/cyan accents, stronger type hierarchy, refined product cards and mobile-first responsive layouts.
- Product catalogue includes live text search, category filtering, A–Z/Z–A sorting and a result count.
- Homepage Reel wall can render official Instagram embeds from verified public Reel permalinks in `reels-config.js`; when none are configured, it shows a designed fallback that links to the official profile. Instagram does not expose an automatic full Reels feed to an ordinary static page, so add real public Reel URLs or connect an approved backend/API.
- Added progressive reveal animation with reduced-motion support and keyboard focus styling.
- See `SECURITY-DEPLOYMENT.md` for what is protected now and what a production backend/hosting setup still needs.
- This remains a static website, not a database-backed admin CMS. GitHub Pages cannot run server-side code.


## V5 updates
- Homepage hero now has an auto-advancing featured-product slider with arrows and dot controls; it pauses on hover/focus and respects reduced-motion settings.
- Instagram Reels use a single horizontal scroll row with previous/next controls and public Instagram embeds.
- Instagram does not provide a reliable public profile-to-Reels embed feed without an approved API integration. Add the individual public Reel permalinks in `reels-config.js` to show playable embedded Reels.

## Instagram demo gallery update
- `reels-config.js` now contains the four Reel URLs supplied for the demo. Instagram may block or limit embedded playback; use the direct Instagram link if an embed fails.
- The homepage has a visual product gallery using five existing product images recovered from the previous YASH TECH site. These are catalogue photos, not an automatic Instagram photo import.
- Automatic profile-wide discovery/download of all Instagram posts is not included: public-profile scraping is unreliable and requires authorized media access for a robust ongoing sync.
