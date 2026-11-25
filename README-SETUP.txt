ZXH OFFICIAL TOOLS — PWA FILES

1) Upload sw.js to the website root so it is available at:
   https://YOUR-DOMAIN/sw.js

2) Upload manifest.json to the website root so it is available at:
   https://YOUR-DOMAIN/manifest.json

3) In the actual HTML document <head>, ensure these tags exist:
   <link rel="manifest" href="/manifest.json">
   <meta name="theme-color" content="#0a0f1c">
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

4) The manifest expects these same-origin icon files:
   /assets/icon-192.png
   /assets/icon-512.png
   Confirm these exact files exist. If your real icon files use other paths,
   change the manifest icon src values to match them.

5) The supplied app bundle already registers /sw.js. Service worker and PWA
   installation require HTTPS (Cloudflare Pages provides HTTPS on its domain).

6) After deploying, open the site in the browser, clear old site data if an
   outdated worker persists, reload twice, and check the browser's install menu.
