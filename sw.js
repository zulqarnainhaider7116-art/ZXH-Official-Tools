/* ================================================================
   ZXH OFFICIAL TOOLS — SERVICE WORKER
   Version: 1.0.1
   Purpose:
   - PWA installation support
   - Safe offline fallback for page navigation
   - Cache static same-origin assets without caching live Firebase data
   - Update cleanup and resilient network fallback

   Deploy this file at the website root as: /sw.js
   ================================================================ */

"use strict";

const ZXH_SW_VERSION = "1.0.1";
const ZXH_CACHE_PREFIX = "zxh-official-tools";
const ZXH_STATIC_CACHE = `${ZXH_CACHE_PREFIX}-static-${ZXH_SW_VERSION}`;
const ZXH_PAGE_CACHE = `${ZXH_CACHE_PREFIX}-pages-${ZXH_SW_VERSION}`;

/*
 * Keep this list limited to paths that are expected to exist.
 * The install event handles failures gracefully so a missing optional
 * path will not prevent the service worker from installing.
 */
const ZXH_PRECACHE_URLS = [
  "/",
  "/manifest.json"
];

/* ----------------------------------------------------------------
   INSTALL
----------------------------------------------------------------- */
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(ZXH_STATIC_CACHE);

    // Cache each entry independently; one missing URL must not break SW install.
    await Promise.all(ZXH_PRECACHE_URLS.map(async (url) => {
      try {
        const response = await fetch(new Request(url, {
          cache: "reload",
          credentials: "same-origin"
        }));
        if (response && response.ok && response.type !== "opaque") {
          await cache.put(url, response.clone());
        }
      } catch (error) {
        // Offline or unavailable optional resource: continue installation.
      }
    }));

    await self.skipWaiting();
  })());
});

/* ----------------------------------------------------------------
   ACTIVATE — remove older versions of this app's caches only
----------------------------------------------------------------- */
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    const obsoleteCaches = cacheNames.filter((cacheName) =>
      cacheName.startsWith(`${ZXH_CACHE_PREFIX}-`) &&
      cacheName !== ZXH_STATIC_CACHE &&
      cacheName !== ZXH_PAGE_CACHE
    );

    await Promise.all(obsoleteCaches.map((cacheName) => caches.delete(cacheName)));
    await self.clients.claim();
  })());
});

/* ----------------------------------------------------------------
   REQUEST FILTERS
----------------------------------------------------------------- */
function isSameOrigin(requestUrl) {
  return requestUrl.origin === self.location.origin;
}

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isCacheableStaticRequest(request, requestUrl) {
  if (request.method !== "GET") return false;
  if (!isSameOrigin(requestUrl)) return false;

  // Do not cache live database, auth, analytics, or API traffic.
  const host = requestUrl.hostname.toLowerCase();
  const path = requestUrl.pathname.toLowerCase();

  if (
    host.includes("firebaseio.com") ||
    host.includes("firebasedatabase.app") ||
    host.includes("googleapis.com") ||
    host.includes("gstatic.com") ||
    path.startsWith("/api/") ||
    path.includes("/__/auth/") ||
    path.includes("analytics")
  ) {
    return false;
  }

  // Cache only common static resources; navigation is handled separately.
  return /\.(?:css|js|mjs|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|json)$/i.test(path);
}

/* ----------------------------------------------------------------
   NAVIGATION STRATEGY — network first, cached page as fallback
----------------------------------------------------------------- */
async function handleNavigationRequest(request) {
  const pageCache = await caches.open(ZXH_PAGE_CACHE);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.ok && networkResponse.type === "basic") {
      pageCache.put(request, networkResponse.clone()).catch(() => {});
      pageCache.put("/", networkResponse.clone()).catch(() => {});
    }

    return networkResponse;
  } catch (error) {
    const exactCachedPage = await pageCache.match(request);
    if (exactCachedPage) return exactCachedPage;

    const cachedHome =
      await pageCache.match("/") ||
      await caches.match("/") ||
      await caches.match("/index.html");

    if (cachedHome) return cachedHome;

    return new Response(
      `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="theme-color" content="#0a0f1c">
        <title>ZXH Official Tools — Offline</title>
        <style>
          *{box-sizing:border-box}
          body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
            background:#0a0f1c;color:#f1f5f9;font:16px/1.6 system-ui,sans-serif}
          main{width:min(100%,520px);padding:28px;border:1px solid #334155;border-radius:24px;
            background:#111827;text-align:center;box-shadow:0 20px 60px #0005}
          h1{margin:0 0 12px;font-size:clamp(24px,6vw,36px)}
          p{color:#cbd5e1}
          button{border:0;border-radius:12px;padding:13px 20px;background:#f1f5f9;
            color:#0f172a;font:700 15px system-ui;cursor:pointer}
          .mark{font-size:42px;font-weight:900;letter-spacing:-3px}
        </style>
      </head>
      <body><main>
        <div class="mark">ZXH</div>
        <h1>You’re currently offline</h1>
        <p>ZXH Official Tools could not reach the website. Check your internet connection, then try again.</p>
        <button onclick="location.reload()">Try again</button>
      </main></body></html>`,
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }
    );
  }
}

/* ----------------------------------------------------------------
   STATIC ASSETS — stale-while-revalidate
----------------------------------------------------------------- */
async function handleStaticRequest(request) {
  const cache = await caches.open(ZXH_STATIC_CACHE);
  const cached = await cache.match(request);

  const networkFetch = fetch(request).then(async (response) => {
    if (response && response.ok && response.type === "basic") {
      await cache.put(request, response.clone());
    }
    return response;
  });

  if (cached) {
    // Refresh cache in the background while serving the cached copy.
    networkFetch.catch(() => {});
    return cached;
  }

  try {
    return await networkFetch;
  } catch (error) {
    return new Response("This resource is unavailable offline.", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}

/* ----------------------------------------------------------------
   FETCH
----------------------------------------------------------------- */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only intercept safe GET requests. Never cache POST/PUT/DELETE requests.
  if (request.method !== "GET") return;

  let requestUrl;
  try {
    requestUrl = new URL(request.url);
  } catch (error) {
    return;
  }

  // Leave cross-origin resources and real-time services untouched.
  if (!isSameOrigin(requestUrl)) return;

  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (isCacheableStaticRequest(request, requestUrl)) {
    event.respondWith(handleStaticRequest(request));
  }
});

/* ----------------------------------------------------------------
   MESSAGE — allow a page to request an update check
----------------------------------------------------------------- */
self.addEventListener("message", (event) => {
  if (!event.data || typeof event.data !== "object") return;

  if (event.data.type === "ZXH_SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* ----------------------------------------------------------------
   BACKGROUND SYNC / PUSH
   Not registered here because the current website does not define
   a backend push or background-sync contract.
----------------------------------------------------------------- */
