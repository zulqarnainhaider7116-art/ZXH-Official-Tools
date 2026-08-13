/* =========================================================
   ZXH OFFICIAL TOOLS
   PWA SERVICE WORKER
   ========================================================= */

"use strict";

const CACHE_NAME = "zxh-tools-v1.0.0";

const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./firebase-config.js",
    "./manifest.json"
];

/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener("install", event => {

    console.log("[ZXH SW] Installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(STATIC_ASSETS);

            })
            .then(() => {

                console.log(
                    "[ZXH SW] Static assets cached."
                );

                return self.skipWaiting();

            })
            .catch(error => {

                console.error(
                    "[ZXH SW] Cache installation failed:",
                    error
                );

            })

    );

});

/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener("activate", event => {

    console.log("[ZXH SW] Activated.");

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(
                            cacheName =>
                                cacheName !== CACHE_NAME
                        )
                        .map(
                            cacheName =>
                                caches.delete(cacheName)
                        )

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});

/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener("fetch", event => {

    const request =
        event.request;

    /*
     * Only handle GET requests.
     */

    if (request.method !== "GET") {
        return;
    }

    /*
     * Firebase/API requests should always
     * use the network.
     */

    const url =
        new URL(request.url);

    if (
        url.hostname.includes(
            "firebaseio.com"
        ) ||
        url.hostname.includes(
            "googleapis.com"
        )
    ) {

        return;

    }

    event.respondWith(

        fetch(request)
            .then(response => {

                /*
                 * Save successful same-origin
                 * responses in cache.
                 */

                if (
                    response &&
                    response.status === 200 &&
                    url.origin === location.origin
                ) {

                    const clonedResponse =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                request,
                                clonedResponse
                            );

                        });

                }

                return response;

            })
            .catch(() => {

                /*
                 * Network unavailable:
                 * return cached version.
                 */

                return caches.match(request)
                    .then(cachedResponse => {

                        if (cachedResponse) {

                            return cachedResponse;

                        }

                        /*
                         * Fallback to index.html
                         * for navigation requests.
                         */

                        if (
                            request.mode ===
                            "navigate"
                        ) {

                            return caches.match(
                                "./index.html"
                            );

                        }

                        return new Response(
                            "Offline — ZXH OFFICIAL TOOLS",
                            {
                                status: 503,
                                headers: {
                                    "Content-Type":
                                        "text/plain; charset=utf-8"
                                }
                            }
                        );

                    });

            })

    );

});

/* =========================================================
   MESSAGE HANDLER
   ========================================================= */

self.addEventListener(
    "message",
    event => {

        if (!event.data) {
            return;
        }

        /*
         * Force immediate activation
         * when app sends SKIP_WAITING.
         */

        if (
            event.data.type ===
            "SKIP_WAITING"
        ) {

            self.skipWaiting();

        }

        /*
         * Clear current cache.
         */

        if (
            event.data.type ===
            "CLEAR_CACHE"
        ) {

            event.waitUntil(

                caches.delete(
                    CACHE_NAME
                )

            );

        }

    }
);

/* =========================================================
   PUSH NOTIFICATION SUPPORT
   ========================================================= */

self.addEventListener(
    "push",
    event => {

        let data = {};

        try {

            data =
                event.data
                    ? event.data.json()
                    : {};

        } catch {

            data = {
                title: "ZXH OFFICIAL TOOLS",
                body:
                    event.data
                        ? event.data.text()
                        : "New notification 🚀"
            };

        }

        const title =
            data.title ||
            "ZXH OFFICIAL TOOLS";

        const options = {

            body:
                data.body ||
                data.message ||
                "You have a new notification.",

            icon:
                data.icon ||
                "./icon-192.png",

            badge:
                data.badge ||
                "./icon-192.png",

            tag:
                data.tag ||
                "zxh-notification",

            renotify: true,

            data: {
                url:
                    data.url ||
                    "./index.html"
            }

        };

        event.waitUntil(

            self.registration
                .showNotification(
                    title,
                    options
                )

        );

    }
);

/* =========================================================
   NOTIFICATION CLICK
   ========================================================= */

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();

        const targetUrl =
            event.notification?.data?.url ||
            "./index.html";

        event.waitUntil(

            clients.matchAll({
                type: "window",
                includeUncontrolled: true
            })
            .then(clientList => {

                for (
                    const client
                    of clientList
                ) {

                    if (
                        "focus" in client
                    ) {

                        client.navigate(
                            targetUrl
                        );

                        return client.focus();

                    }

                }

                if (
                    clients.openWindow
                ) {

                    return clients.openWindow(
                        targetUrl
                    );

                }

            })

        );

    }
);

console.log(
    "[ZXH SW] ZXH OFFICIAL TOOLS Service Worker loaded ☠️😈"
);