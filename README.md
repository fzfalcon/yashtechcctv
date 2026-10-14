# YASH TECH CCTV — Modern Astro Edition

A modern component-based redesign built with **Astro 5, TypeScript, Tailwind CSS 4**, and static output for GitHub Pages.

## What is included
- Astro layouts and reusable components instead of duplicated page markup.
- Responsive premium security-tech design with a cinematic hero carousel.
- Catalogue search/category filter and 23 statically generated product detail pages.
- Product-specific WhatsApp enquiry links and a contact form that opens a prefilled WhatsApp message.
- Exact supplied WhatsApp PNG, existing product images, logo and seven hero banners.
- Ten supplied Instagram Reel links.
- Reduced-motion support, desktop-only cursor/spotlight and card hover interactions; touch devices keep native touch behavior.
- GitHub Actions workflow to build and deploy to GitHub Pages.

## Local development
Install Node.js 22 or newer, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Astro.

Build and preview the production site:

```bash
npm run build
npm run preview
```

## GitHub Pages deployment
1. Put the contents of this project in the `main` branch of the repository named `yashtechcctv`.
2. In GitHub, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and deploys `dist/`.
4. The current workflow assumes the project URL `https://fzfalcon.github.io/yashtechcctv/`. If the repository has a different name, update `base` in `astro.config.mjs`.

## Custom domain
When configuring `yashtechcctv.com` as a GitHub Pages custom domain, set the Astro `base` to `/` for that deployment and configure the domain/DNS as required by GitHub Pages. The existing domain/hosting setup is not changed by this code package.

## Business information preserved
- WhatsApp: +91 86670 15532 (`918667015532`)
- Instagram: [@yashtechcctv](https://www.instagram.com/yashtechcctv/)
- Address: 152/1 Railway Station Road, opposite Kalyan Jewellerys, Ramanathapuram – 623504
- Phone from archived website: +91 93858 98667

Product specs and availability were recovered from the archived public catalogue. Confirm exact model variants, compatibility, current stock and prices with YASH TECH before purchase.

## Note on static hosting
This is a static website. The contact form prepares a WhatsApp message; it does not store submissions in a database. Customer accounts, stock management, or an admin dashboard would require a backend.
