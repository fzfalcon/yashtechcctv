# Security and production deployment notes

This package is a static front end with client-side interactions. It is not a full database-backed CMS or admin panel. GitHub Pages can host the front end, but it does not run server code or provide a private database.

## Included safeguards
- WhatsApp links use HTTPS and set `rel="noopener noreferrer"` when opened in a new tab.
- Instagram Reel URLs are restricted to HTTPS `www.instagram.com/reel/...` links before rendering.
- No passwords, API tokens, or private credentials are included in the front-end files. Never put secrets in JavaScript shipped to browsers.
- Forms validate basic required fields and open WhatsApp; they do not store enquiries on the website server.
- Reduced-motion preference and visible keyboard focus styles are supported.

## Production security checklist
1. Keep the domain on HTTPS with a valid, auto-renewing certificate. Fix any browser certificate/security warning before advertising the site.
2. Enable MFA on the domain registrar, hosting provider, GitHub account and any connected Meta account. Use unique passwords and least-privilege collaborators.
3. Keep the domain DNS and registrar access with the business owner; do not publish credentials in this repository.
4. If hosted on Cloudflare Pages or a server that supports response headers, configure a Content-Security-Policy, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and `Strict-Transport-Security` only after verifying HTTPS and required third-party domains. GitHub Pages does not support custom response headers through repository files alone.
5. For a real admin dashboard, inventory, protected product edits, or saved enquiry records, connect a backend/CMS (for example a secured Supabase project with row-level security). Keep privileged keys server-side and apply database policies before launch.
6. Test mobile layouts, WhatsApp number ownership, all catalogue links, Instagram embeds, 404s, performance and accessibility before publishing.

## Instagram Reel setup
Edit `reels-config.js` and add public Reel permalinks from the official YASH TECH account. Example format:

```js
window.YASH_REELS = [
  { url: "https://www.instagram.com/reel/REPLACE_WITH_REAL_SHORTCODE/", label: "Solar camera demo" }
];
```

Replace the example with real links only. The homepage does not scrape Instagram or pretend to have a live feed when no Reel URLs are configured. Instagram controls whether an embed is available and how it renders.
