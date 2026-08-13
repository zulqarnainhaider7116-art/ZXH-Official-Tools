// ============================================================
// ZXH OFFICIAL TOOLS
// APP.JS — REALTIME DATABASE EDITION
// ============================================================
// Firebase Realtime Database ONLY
// Firestore = NOT USED
//
// First Run:
//   1. Check RTDB
//   2. Seed missing default data
//   3. Load everything from RTDB
//
// Runtime:
//   Tools
//   Menu
//   Site Settings
//   Stats
//   Likes
//   Views
//   Popups
//   Maintenance
//   Notifications
//
// ============================================================

"use strict";


// ============================================================
// FIREBASE
// ============================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    onValue,
    runTransaction
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

import firebaseConfig from "./firebase-config.js";


// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

let firebaseApp = null;
let database = null;

try {

    firebaseApp =
        initializeApp(firebaseConfig);

    database =
        getDatabase(firebaseApp);

    console.log(
        "%c ZXH OFFICIAL TOOLS ",
        "background:#7c3aed;color:#fff;padding:7px 14px;border-radius:8px;font-weight:900"
    );

    console.log(
        "🔥 Firebase Realtime Database initialized."
    );

}
catch (error) {

    console.error(
        "❌ Firebase initialization failed:",
        error
    );

}


// ============================================================
// GLOBAL STATE
// ============================================================

const AppState = {

    firebaseReady:
        !!database,

    initialized: false,

    seeding: false,

    deferredInstallPrompt: null,

    installPromptDismissed:
        localStorage.getItem(
            "zxh_install_prompt_dismissed"
        ) === "true",

    currentCategory: "all",

    searchQuery: "",

    tools: [],

    menu: [],

    settings: {},

    stats: {},

    maintenance: {},

    notifications: {},

    popups: {},

    likes: {},

    views: {}

};


// ============================================================
// DEFAULT DATABASE DATA
// ============================================================
// IMPORTANT:
//
// This data is only used when the corresponding RTDB
// location does not exist.
//
// Existing database values are preserved.
//
// After the first successful seed, you can remove this
// DEFAULT_DATA object later and keep the app database-driven.
// ============================================================

const DEFAULT_DATA = {

    settings: {

        siteTitle:
            "ZXH OFFICIAL TOOLS",

        siteDescription:
            "Premium Toolkit — Zulqarnain X Haider",

        logoUrl:
            "https://i.ibb.co/ZRY5X0d0/Gemini-Generated-Image-raajdoraajdoraaj.png",

        whatsappChannel:
            "https://whatsapp.com/channel/0029Vb6lszR7YSd3iYfa2V0n",

        whatsappGroup:
            "https://chat.whatsapp.com/B9n6M7WVWey8BbgxrFgCKr",

        contactWhatsapp:
            "https://wa.me/message/VP5WENBFNFKCM1",

        footerText:
            "© 2026 All Copyrights Reserved | Powered by Zulqarnain X Haider",

        popup1Enabled: true,

        popup2Enabled: true,

        popup3Enabled: true

    },


    stats: {

        views: 0,

        likes: 0,

        totalTools: 37

    },


    maintenance: {

        enabled: false,

        title:
            "ZXH OFFICIAL TOOLS",

        message:
            "Website is currently under maintenance. Please check again soon.",

        showButton: true,

        buttonText:
            "Refresh",

        updatedAt:
            Date.now()

    },


    notifications: {

        active: {

            enabled: false,

            id:
                "default-notification",

            title:
                "ZXH OFFICIAL TOOLS",

            message:
                "Welcome to ZXH OFFICIAL TOOLS.",

            type:
                "info",

            timestamp:
                Date.now()

        }

    },


    popups: {

        popup1: {

            enabled: true,

            title:
                "Welcome To ZXH OFFICIAL TOOLS ☠️",

            message:
                "Explore premium free tools powered by ZXH OFFICIAL.",

            type:
                "info",

            buttonText:
                "Got It"

        },

        popup2: {

            enabled: false,

            title:
                "ZXH OFFICIAL 🚀",

            message:
                "More powerful tools are coming soon.",

            type:
                "success",

            buttonText:
                "Continue"

        },

        popup3: {

            enabled: false,

            title:
                "Important Notice",

            message:
                "Always use tools responsibly.",

            type:
                "warning",

            buttonText:
                "Understood"

        }

    },


    menu: {

        all: {

            label:
                "All",

            link:
                "#",

            icon:
                "",

            section:
                "Categories",

            order:
                1,

            category:
                "all"

        },

        socialMedia: {

            label:
                "Social Media",

            link:
                "#",

            icon:
                "",

            section:
                "Categories",

            order:
                2,

            category:
                "social"

        },

        hacking: {

            label:
                "Hacking",

            link:
                "#",

            icon:
                "",

            section:
                "Categories",

            order:
                3,

            category:
                "hacking"

        },

        ownerContact: {

            label:
                "Owner Contact",

            link:
                "https://wa.me/message/VP5WENBFNFKCM1",

            icon:
                "fab fa-whatsapp",

            section:
                "Contact",

            order:
                4

        },

        whatsappChannel: {

            label:
                "WhatsApp Channel",

            link:
                "https://whatsapp.com/channel/0029Vb6lszR7YSd3iYfa2V0n",

            icon:
                "fab fa-whatsapp",

            section:
                "Contact",

            order:
                5

        },

        whatsappGroup: {

            label:
                "WhatsApp Group",

            link:
                "https://chat.whatsapp.com/B9n6M7WVWey8BbgxrFgCKr",

            icon:
                "fab fa-whatsapp",

            section:
                "Contact",

            order:
                6

        }

    },


    tools: {

        "99-name-of-allah": {
            name: "99 Name Of Allah",
            icon: "https://i.ibb.co/S4fchB8S/image-search-1777733068480.jpg",
            link: "https://zxh-paid-hosting.gt.tc/?slug=99-names-of-allah",
            category: "all",
            order: 1
        },

        "99-name-of-muhammad": {
            name: "99 Name OF Muhammad",
            icon: "https://i.ibb.co/MDYgC7D3/image-search-1777733128931.png",
            link: "https://name-of-muhammad.pages.dev",
            category: "all",
            order: 2
        },

        "age-calculater": {
            name: "Age Calculater 🗓️",
            icon: "https://i.ibb.co/k2f0HqMs/image-search-1777731728380.png",
            link: "https://zxh-age-calculater.pages.dev",
            category: "hacking",
            order: 3
        },

        "ai-image-generater": {
            name: "Ai Image Generater",
            icon: "https://i.ibb.co/Pv59mWSz/image-search-1778546217604.png",
            link: "https://zxh-ai-img-generater.pages.dev/",
            category: "social",
            order: 4
        },

        "ai-prompt-generater": {
            name: "Ai Prompt Generater",
            icon: "https://i.ibb.co/xSpGXr74/image-search-1777999774921.png",
            link: "https://zxh-prompt-ai.pages.dev/",
            category: "hacking",
            order: 5
        },

        "ai-website-builder": {
            name: "Ai Website Builder",
            icon: "https://i.ibb.co/Cpvy8QL5/image-search-1778423512778.jpg",
            link: "https://zxh-ai-web-creater.pages.dev/",
            category: "hacking",
            order: 6
        },

        "all-html-tools": {
            name: "ALL HTML TOOLS ☠️😈",
            icon: "https://i.ibb.co/yBXLmcpx/image-search-1777730578498.png",
            link: "https://zxh-paid-hosting.gt.tc/?slug=all-html-tools",
            category: "hacking",
            order: 7
        },

        "alquran-ul-alhkrim": {
            name: "AlQuran-Ul-Alkrim",
            icon: "https://i.postimg.cc/d3QBZsks/file_00000000708872079ccfb04f204166f1.png",
            link: "https://zxh-holy-quran.vercel.app/",
            category: "all",
            order: 8
        },

        "bloger-ai": {
            name: "Bloger Ai 🤖",
            icon: "https://i.ibb.co/fV9hJ6jm/image-search-1777313763964.jpg",
            link: "https://zxh-premium-host.ct.ws/?slug=bloger-ai",
            category: "hacking",
            order: 9
        },

        "fb-video-downloader": {
            name: "FB VIDEO DOWNLOADER ☠️🌑",
            icon: "https://i.postimg.cc/C5TMJq6B/IMG-20260123-203730.png",
            link: "https://zxh-official-fb-saver.pages.dev",
            category: "social",
            order: 10
        },

        "temp-mail-pro": {
            name: "TEMP MAIL PRO",
            icon: "https://i.postimg.cc/28K4dy56/IMG-20260117-000658.png",
            link: "https://zxh-temp-mail-pro.pages.dev/",
            category: "all",
            order: 11
        },

        "txt-to-speech": {
            name: "TXT TO SPEACH ☠️",
            icon: "https://i.postimg.cc/SR0KN0QC/IMG-20260117-001424.png",
            link: "https://zxh-txt-to-speech.pages.dev/",
            category: "social",
            order: 12
        },

        "zxh-gf": {
            name: "ZXH GF ❤️😘",
            icon: "https://i.ibb.co/KxdJtn3b/image-search-1777999988118.png",
            link: "https://zxh-paid-hosting.gt.tc/?slug=zxh-gf-1",
            category: "social",
            order: 13
        },

        "zxh-pixels": {
            name: "ZXH PIXELS 😈☠️🌑",
            icon: "https://i.ibb.co/YBT96cR0/1000247255.jpg",
            link: "https://zxh-paid-hosting.gt.tc/?slug=zxh-images-searcher",
            category: "social",
            order: 14
        },

        "zxh-profile-stalker": {
            name: "ZXH PROFILE STALKER ☠️😈",
            icon: "https://i.ibb.co/gLbf7DsH/1000198763.png",
            link: "https://zxh-profile-stalker.pages.dev",
            category: "hacking",
            order: 15
        },

        "zxh-ultra-wallpapers": {
            name: "ZXH ULTRA WALLPAPERS ☠️😈",
            icon: "https://i.postimg.cc/9XpnPdT7/IMG-20260117-005533.png",
            link: "https://zxh-wallpaper-pro.pages.dev/",
            category: "social",
            order: 16
        },

        "zxh-web-ss-fetcher": {
            name: "ZXH WEB SS FETCHER 😈☠️",
            icon: "https://i.ibb.co/n8qMgw2Z/image-search-1780401391246.png",
            link: "https://zxh-paid-hosting.gt.tc/?slug=full-web-ss",
            category: "hacking",
            order: 17
        },

        "zxh-wp-post-maker": {
            name: "ZXH WP POST MAKER 😈☠️",
            icon: "https://i.ibb.co/4ZcRvxg6/318ef9063044.png",
            link: "https://zxh-paid-hosting.gt.tc/?slug=wp-post-maker",
            category: "social",
            order: 18
        },

        "free-hosting": {
            name: "Free Hosting 💯🥱",
            icon: "https://i.ibb.co/SXGmcbDn/image-search-1778425756923.jpg",
            link: "https://zxh-paid-hosting.gt.tc/",
            category: "hacking",
            order: 19
        },

        "html-editor": {
            name: "HTML EDITOR 1",
            icon: "https://i.ibb.co/m5g62V2M/image-search-1777730586887.png",
            link: "https://zxh-html-editor.pages.dev/",
            category: "hacking",
            order: 20
        },

        "html-encrypter": {
            name: "HTML ENCRYPTER",
            icon: "https://i.ibb.co/wh4Bmx9p/image-search-1777730954276.png",
            link: "https://zxh-official-encrypter.pages.dev/",
            category: "hacking",
            order: 21
        },

        "html-obfuscated-tool": {
            name: "Html obfuscated Tool",
            icon: "https://i.ibb.co/2YCT0vfm/image-search-1777730967344.webp",
            link: "https://zxh-obfuscater.pages.dev/",
            category: "hacking",
            order: 22
        },

        "img-to-link": {
            name: "Img TO LINK 🖇️ ☠️",
            icon: "https://i.postimg.cc/j5TV979z/file_000000004b4071faa361d051dac1b65e.png",
            link: "https://zxh-img-to-link.pages.dev/",
            category: "social",
            order: 23
        },

        "instagram-downloader": {
            name: "Instagram Downloader",
            icon: "https://i.ibb.co/HLz8C0QB/image-search-1777729915227.jpg",
            link: "https://zxh-insta-saver.pages.dev/",
            category: "social",
            order: 24
        },

        "islamic-portal": {
            name: "Islamic Portal 🕋🕌",
            icon: "https://i.ibb.co/xxYhZsx/image-search-1777726817866.png",
            link: "https://zxh-islamic-portal.zulqarnainhaider7116.workers.dev/",
            category: "all",
            order: 25
        },

        "link-shortener": {
            name: "Link Shortener",
            icon: "https://i.ibb.co/whj4W0qD/image-search-1778547266807.png",
            link: "https://zxh-link-shortner.pages.dev/",
            category: "hacking",
            order: 26
        },

        "live-sports-tv": {
            name: "Live Sports TV",
            icon: "https://i.ibb.co/MywJTLsb/image-search-1778549407849.png",
            link: "https://zxh-sports-tv.pages.dev",
            category: "social",
            order: 27
        },

        "madni-channel-tv": {
            name: "Madni Channel /TV",
            icon: "https://i.ibb.co/67vRGSk5/image-search-1777732714423.jpg",
            link: "https://zxh-live-madni-tv.pages.dev/",
            category: "all",
            order: 28
        },

        "sim-database": {
            name: "Sim Database",
            icon: "https://i.ibb.co/qLWXhJpY/image-search-1778050710968.png",
            link: "https://zxh-sim-database.pages.dev",
            category: "hacking",
            order: 29
        },

        "sms-bomber": {
            name: "Sms Bomber 🥱😎",
            icon: "https://i.ibb.co/BRnDJfz/image-search-1777720073805.png",
            link: "https://zxh-sms-bomber.pages.dev/",
            category: "hacking",
            order: 30
        },

        "source-code-extractor": {
            name: "Source Code extractor",
            icon: "https://i.ibb.co/ksM1Snbp/image-search-1778546510723.png",
            link: "https://zxh-paid-hosting.gt.tc/?slug=web-code-fetcher",
            category: "hacking",
            order: 31
        },

        "text-to-file-converter": {
            name: "Text To File Converter 🧮",
            icon: "https://i.ibb.co/qMH6s8JQ/image-search-1777871565412.png",
            link: "https://zxh-txt-to-file.pages.dev/",
            category: "hacking",
            order: 32
        },

        "tiktok-downloader": {
            name: "Tiktok downloader",
            icon: "https://i.ibb.co/Kpz7xyYW/image-search-1777720137008.webp",
            link: "https://zxh-tt-saver.pages.dev/",
            category: "social",
            order: 33
        },

        "whatsapp-banned-tool": {
            name: "WhatsApp Banned Tool 🥱",
            icon: "https://i.ibb.co/qMJb2wds/image-search-1778002242777.jpg",
            link: "https://zxh-whatsapp-ban-tool.pages.dev/",
            category: "hacking",
            order: 34
        },

        "whatsapp-unbanned-tool": {
            name: "WhatsApp Unbanned Tool",
            icon: "https://i.ibb.co/4wSC8Nh6/image-search-1778546066667.jpg",
            link: "https://zxh-paid-hosting.gt.tc/?slug=zxh-wp-unban-tool",
            category: "hacking",
            order: 35
        },

        "youtube-thumbnail-downloader": {
            name: "YouTube Thumbnail Downloader",
            icon: "https://i.ibb.co/NnVyRDq7/image-search-1778546319762.webp",
            link: "https://zxh-yt-thmnail-down.pages.dev/",
            category: "social",
            order: 36
        },

        "youtube-watching-time": {
            name: "YouTube Watching Time",
            icon: "https://i.ibb.co/1tdcRpQn/image-search-1778546383364.webp",
            link: "https://zxh-yt-watch-time.pages.dev/",
            category: "social",
            order: 37
        }

    }

};


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupLucide();

        setupSearch();

        setupCategories();

        setupInstallPrompt();

        setupPWA();

        setupGlobalEvents();

        await initializeZXH();

    }
);


// ============================================================
// MAIN INITIALIZATION
// ============================================================

async function initializeZXH() {

    if (!database) {

        showToast(
            "Firebase connection unavailable.",
            "error"
        );

        return;

    }

    try {

        console.log(
            "🔥 Checking ZXH Realtime Database..."
        );

        await seedMissingDatabaseData();

        await loadDatabaseSnapshot();

        setupRealtimeListeners();

        setupStatsTracking();

        AppState.initialized = true;

        console.log(
            "✅ ZXH OFFICIAL TOOLS ready."
        );

    }
    catch (error) {

        console.error(
            "❌ ZXH initialization error:",
            error
        );

        showToast(
            "Failed to load tools database.",
            "error"
        );

    }

}


// ============================================================
// FIRST-RUN DATABASE SEED
// ============================================================

async function seedMissingDatabaseData() {

    if (AppState.seeding) return;

    AppState.seeding = true;

    try {

        const rootRef =
            ref(database);

        const snapshot =
            await get(rootRef);

        const existing =
            snapshot.val() || {};

        const updates = {};

        // ----------------------------------------------------
        // SETTINGS
        // ----------------------------------------------------

        if (
            !existing.settings
        ) {

            updates.settings =
                DEFAULT_DATA.settings;

        }
        else {

            const current =
                existing.settings;

            Object.keys(
                DEFAULT_DATA.settings
            ).forEach(
                key => {

                    if (
                        current[key] ===
                        undefined
                    ) {

                        updates[
                            `settings/${key}`
                        ] =
                            DEFAULT_DATA.settings[key];

                    }

                }
            );

        }


        // ----------------------------------------------------
        // STATS
        // ----------------------------------------------------

        if (
            !existing.stats
        ) {

            updates.stats =
                DEFAULT_DATA.stats;

        }
        else {

            if (
                existing.stats.views ===
                undefined
            ) {

                updates[
                    "stats/views"
                ] = 0;

            }

            if (
                existing.stats.likes ===
                undefined
            ) {

                updates[
                    "stats/likes"
                ] = 0;

            }

            if (
                existing.stats.totalTools ===
                undefined
            ) {

                updates[
                    "stats/totalTools"
                ] =
                    Object.keys(
                        DEFAULT_DATA.tools
                    ).length;

            }

        }


        // ----------------------------------------------------
        // MAINTENANCE
        // ----------------------------------------------------

        if (
            !existing.maintenance
        ) {

            updates.maintenance =
                DEFAULT_DATA.maintenance;

        }


        // ----------------------------------------------------
        // NOTIFICATIONS
        // ----------------------------------------------------

        if (
            !existing.notifications
        ) {

            updates.notifications =
                DEFAULT_DATA.notifications;

        }


        // ----------------------------------------------------
        // POPUPS
        // ----------------------------------------------------

        if (
            !existing.popups
        ) {

            updates.popups =
                DEFAULT_DATA.popups;

        }


        // ----------------------------------------------------
        // TOOLS
        // ----------------------------------------------------

        Object.entries(
            DEFAULT_DATA.tools
        ).forEach(
            ([id, tool]) => {

                if (
                    !existing.tools ||
                    !existing.tools[id]
                ) {

                    updates[
                        `tools/${id}`
                    ] = tool;

                }

            }
        );


        // ----------------------------------------------------
        // MENU
        // ----------------------------------------------------

        Object.entries(
            DEFAULT_DATA.menu
        ).forEach(
            ([id, item]) => {

                if (
                    !existing.menu ||
                    !existing.menu[id]
                ) {

                    updates[
                        `menu/${id}`
                    ] = item;

                }

            }
        );


        // ----------------------------------------------------
        // WRITE ONLY IF NECESSARY
        // ----------------------------------------------------

        if (
            Object.keys(updates).length > 0
        ) {

            console.log(
                "🌱 Missing RTDB data detected."
            );

            console.log(
                "🌱 Seeding missing default data..."
            );

            await update(
                rootRef,
                updates
            );

            console.log(
                "✅ Default database data saved."
            );

        }
        else {

            console.log(
                "✅ Database already initialized."
            );

        }

    }
    finally {

        AppState.seeding = false;

    }

}


// ============================================================
// LOAD COMPLETE DATABASE
// ============================================================

async function loadDatabaseSnapshot() {

    const snapshot =
        await get(
            ref(database)
        );

    const data =
        snapshot.val() || {};


    AppState.settings =
        data.settings || {};

    AppState.stats =
        data.stats || {};

    AppState.maintenance =
        data.maintenance || {};

    AppState.notifications =
        data.notifications || {};

    AppState.popups =
        data.popups || {};

    AppState.tools =
        objectToSortedArray(
            data.tools
        );

    AppState.menu =
        objectToSortedArray(
            data.menu
        );


    // --------------------------------------------------------
    // Render
    // --------------------------------------------------------

    applySiteSettings();

    applyStats();

    renderTools();

    renderMenu();

    applyPopupSettings();

    handleMaintenanceState(
        AppState.maintenance
    );

    handleNotifications(
        AppState.notifications
    );


    console.log(
        "📦 Database loaded:",
        {
            tools:
                AppState.tools.length,

            menu:
                AppState.menu.length,

            settings:
                AppState.settings,

            stats:
                AppState.stats

        }
    );

}


// ============================================================
// REALTIME DATABASE LISTENERS
// ============================================================

function setupRealtimeListeners() {


    // --------------------------------------------------------
    // SETTINGS
    // --------------------------------------------------------

    onValue(
        ref(
            database,
            "settings"
        ),
        snapshot => {

            AppState.settings =
                snapshot.val() || {};

            applySiteSettings();

            applyPopupSettings();

        }
    );


    // --------------------------------------------------------
    // TOOLS
    // --------------------------------------------------------

    onValue(
        ref(
            database,
            "tools"
        ),
        snapshot => {

            AppState.tools =
                objectToSortedArray(
                    snapshot.val()
                );

            renderTools();

        }
    );


    // --------------------------------------------------------
    // MENU
    // --------------------------------------------------------

    onValue(
        ref(
            database,
            "menu"
        ),
        snapshot => {

            AppState.menu =
                objectToSortedArray(
                    snapshot.val()
                );

            renderMenu();

        }
    );


    // --------------------------------------------------------
    // STATS
    // --------------------------------------------------------

    onValue(
        ref(
            database,
            "stats"
        ),
        snapshot => {

            AppState.stats =
                snapshot.val() || {};

            applyStats();

        }
    );


    // --------------------------------------------------------
    // MAINTENANCE
    // --------------------------------------------------------

    onValue(
        ref(
            database,
            "maintenance"
        ),
        snapshot => {

            AppState.maintenance =
                snapshot.val() || {};

            handleMaintenanceState(
                AppState.maintenance
            );

        }
    );


    // --------------------------------------------------------
    // NOTIFICATIONS
    // --------------------------------------------------------

    onValue(
        ref(
            database,
            "notifications"
        ),
        snapshot => {

            AppState.notifications =
                snapshot.val() || {};

            handleNotifications(
                AppState.notifications
            );

        }
    );


    // --------------------------------------------------------
    // POPUPS
    // --------------------------------------------------------

    onValue(
        ref(
            database,
            "popups"
        ),
        snapshot => {

            AppState.popups =
                snapshot.val() || {};

            handlePopups(
                AppState.popups
            );

        }
    );

}


// ============================================================
// OBJECT → SORTED ARRAY
// ============================================================

function objectToSortedArray(
    object
) {

    if (
        !object ||
        typeof object !==
        "object"
    ) {

        return [];

    }

    return Object.entries(
        object
    )
    .map(
        ([id, data]) => ({
            id,
            ...(data || {})
        })
    )
    .sort(
        (a, b) =>
            Number(a.order || 999999) -
            Number(b.order || 999999)
    );

}


// ============================================================
// SITE SETTINGS
// ============================================================

function applySiteSettings() {

    const settings =
        AppState.settings || {};


    if (
        settings.siteTitle
    ) {

        document.title =
            settings.siteTitle;

    }


    // --------------------------------------------------------
    // Meta Description
    // --------------------------------------------------------

    if (
        settings.siteDescription
    ) {

        let meta =
            document.querySelector(
                'meta[name="description"]'
            );

        if (!meta) {

            meta =
                document.createElement(
                    "meta"
                );

            meta.name =
                "description";

            document.head.appendChild(
                meta
            );

        }

        meta.content =
            settings.siteDescription;

    }


    // --------------------------------------------------------
    // Logo
    // --------------------------------------------------------

    if (
        settings.logoUrl
    ) {

        document
            .querySelectorAll(
                "[data-site-logo]"
            )
            .forEach(
                element => {

                    if (
                        element.tagName
                            .toLowerCase() ===
                        "img"
                    ) {

                        element.src =
                            settings.logoUrl;

                    }

                }
            );

    }


    // --------------------------------------------------------
    // Generic Settings Bindings
    // --------------------------------------------------------

    document
        .querySelectorAll(
            "[data-setting]"
        )
        .forEach(
            element => {

                const key =
                    element.dataset.setting;

                const value =
                    settings[key];

                if (
                    value ===
                    undefined
                ) return;

                if (
                    element.tagName
                        .toLowerCase() ===
                    "input"
                ) {

                    element.value =
                        value;

                }
                else {

                    element.textContent =
                        value;

                }

            }
        );


    // --------------------------------------------------------
    // Footer
    // --------------------------------------------------------

    if (
        settings.footerText
    ) {

        document
            .querySelectorAll(
                "[data-footer]"
            )
            .forEach(
                element => {

                    element.textContent =
                        settings.footerText;

                }
            );

    }


    // --------------------------------------------------------
    // WhatsApp Links
    // --------------------------------------------------------

    bindLink(
        "[data-whatsapp-channel]",
        settings.whatsappChannel
    );

    bindLink(
        "[data-whatsapp-group]",
        settings.whatsappGroup
    );

    bindLink(
        "[data-owner-contact]",
        settings.contactWhatsapp
    );

}


// ============================================================
// BIND LINK
// ============================================================

function bindLink(
    selector,
    url
) {

    if (!url) return;

    document
        .querySelectorAll(
            selector
        )
        .forEach(
            element => {

                element.href =
                    url;

            }
        );

}


// ============================================================
// STATS
// ============================================================

function applyStats() {

    const stats =
        AppState.stats || {};


    const views =
        Number(
            stats.views || 0
        );

    const likes =
        Number(
            stats.likes || 0
        );


    document
        .querySelectorAll(
            "[data-stat='views']"
        )
        .forEach(
            element => {

                element.textContent =
                    formatNumber(
                        views
                    );

            }
        );


    document
        .querySelectorAll(
            "[data-stat='likes']"
        )
        .forEach(
            element => {

                element.textContent =
                    formatNumber(
                        likes
                    );

            }
        );


    document
        .querySelectorAll(
            "[data-stat='tools']"
        )
        .forEach(
            element => {

                element.textContent =
                    formatNumber(
                        AppState.tools.length
                    );

            }
        );

}


// ============================================================
// FORMAT NUMBER
// ============================================================

function formatNumber(
    number
) {

    return Number(
        number || 0
    ).toLocaleString(
        "en-US"
    );

}


// ============================================================
// TOOL RENDERING
// ============================================================

function renderTools() {

    const grid =
        document.querySelector(
            ".tools-grid"
        );

    if (!grid) {

        filterTools();

        return;

    }


    // --------------------------------------------------------
    // Detect existing static cards
    // --------------------------------------------------------

    const hasDatabaseCards =
        grid.querySelector(
            ".tool-card"
        );


    if (
        !hasDatabaseCards
    ) {

        grid.innerHTML = "";

        AppState.tools.forEach(
            tool => {

                grid.appendChild(
                    createToolCard(
                        tool
                    )
                );

            }
        );

    }
    else {

        // Existing HTML cards are kept.
        // Update their database metadata.

        AppState.tools.forEach(
            tool => {

                const card =
                    grid.querySelector(
                        `[data-tool-id="${CSS.escape(tool.id)}"]`
                    );

                if (!card) return;

                updateToolCard(
                    card,
                    tool
                );

            }
        );

    }


    filterTools();

    setupLucide();

}


// ============================================================
// CREATE TOOL CARD
// ============================================================

function createToolCard(
    tool
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "tool-card";

    card.dataset.toolId =
        tool.id;

    card.dataset.name =
        tool.name || "";

    card.dataset.description =
        tool.description || "";

    card.dataset.category =
        tool.category || "all";


    card.innerHTML = `

        <a
            href="${escapeAttribute(tool.link || "#")}"
            class="tool-link"
            data-tool-link="${escapeAttribute(tool.link || "#")}"
        >

            <div class="tool-icon">

                <img
                    src="${escapeAttribute(tool.icon || "")}"
                    alt="${escapeAttribute(tool.name || "Tool")}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >

            </div>

            <div class="tool-info">

                <h3>
                    ${escapeHTML(
                        tool.name || "Untitled Tool"
                    )}
                </h3>

                ${
                    tool.description
                    ? `
                        <p>
                            ${escapeHTML(
                                tool.description
                            )}
                        </p>
                    `
                    : ""
                }

            </div>

        </a>

    `;

    return card;

}


// ============================================================
// UPDATE TOOL CARD
// ============================================================

function updateToolCard(
    card,
    tool
) {

    card.dataset.name =
        tool.name || "";

    card.dataset.description =
        tool.description || "";

    card.dataset.category =
        tool.category || "all";


    const title =
        card.querySelector(
            "h3"
        );

    if (title) {

        title.textContent =
            tool.name || "";

    }


    const image =
        card.querySelector(
            "img"
        );

    if (
        image &&
        tool.icon
    ) {

        image.src =
            tool.icon;

        image.alt =
            tool.name || "Tool";

    }


    const link =
        card.querySelector(
            "a"
        );

    if (
        link &&
        tool.link
    ) {

        link.href =
            tool.link;

        link.dataset.toolLink =
            tool.link;

    }

}


// ============================================================
// MENU RENDERING
// ============================================================

function renderMenu() {

    const containers =
        document.querySelectorAll(
            "[data-menu-container]"
        );

    if (
        !containers.length
    ) return;


    containers.forEach(
        container => {

            container.innerHTML = "";

            AppState.menu.forEach(
                item => {

                    const element =
                        document.createElement(
                            "a"
                        );

                    element.href =
                        item.link || "#";

                    element.className =
                        "menu-item";

                    if (
                        item.category
                    ) {

                        element.dataset.category =
                            item.category;

                    }

                    if (
                        item.icon
                    ) {

                        element.innerHTML =
                            `
                                <i class="${escapeAttribute(item.icon)}"></i>
                                <span>
                                    ${escapeHTML(
                                        item.label || ""
                                    )}
                                </span>
                            `;

                    }
                    else {

                        element.innerHTML =
                            `
                                <span>
                                    ${escapeHTML(
                                        item.label || ""
                                    )}
                                </span>
                            `;

                    }

                    container.appendChild(
                        element
                    );

                }
            );

        }
    );


    setupLucide();

}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const input =
        document.getElementById(
            "toolSearch"
        );

    if (!input) return;


    input.addEventListener(
        "input",
        event => {

            AppState.searchQuery =
                event.target.value
                    .trim()
                    .toLowerCase();

            filterTools();

        }
    );

}


// ============================================================
// CATEGORIES
// ============================================================

function setupCategories() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-category]"
                );

            if (!button) return;


            const category =
                button.dataset.category ||
                "all";


            // Don't hijack normal external links
            if (
                button.tagName
                    .toLowerCase() ===
                "a" &&
                button.getAttribute("href") &&
                button.getAttribute("href") !== "#"
            ) {

                return;

            }


            event.preventDefault();


            AppState.currentCategory =
                category;


            document
                .querySelectorAll(
                    "[data-category]"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


            button.classList.add(
                "active"
            );


            filterTools();

        }
    );

}


// ============================================================
// FILTER TOOLS
// ============================================================

function filterTools() {

    const cards =
        document.querySelectorAll(
            ".tool-card"
        );

    const query =
        AppState.searchQuery;

    const category =
        AppState.currentCategory;


    let visibleCount =
        0;


    cards.forEach(
        card => {

            const name =
                (
                    card.dataset.name ||
                    card.querySelector(
                        "h3"
                    )?.textContent ||
                    ""
                ).toLowerCase();


            const description =
                (
                    card.dataset.description ||
                    card.querySelector(
                        "p"
                    )?.textContent ||
                    ""
                ).toLowerCase();


            const cardCategory =
                (
                    card.dataset.category ||
                    "all"
                ).toLowerCase();


            const matchesSearch =
                !query ||
                name.includes(query) ||
                description.includes(query);


            const matchesCategory =
                category === "all" ||
                cardCategory === category;


            const visible =
                matchesSearch &&
                matchesCategory;


            card.style.display =
                visible
                    ? ""
                    : "none";


            if (visible) {

                visibleCount++;

            }

        }
    );


    updateNoResults(
        visibleCount
    );

}


// ============================================================
// NO RESULTS
// ============================================================

function updateNoResults(
    count
) {

    let noResults =
        document.getElementById(
            "noResults"
        );


    if (
        count > 0
    ) {

        if (noResults) {

            noResults.style.display =
                "none";

        }

        return;

    }


    if (!noResults) {

        noResults =
            document.createElement(
                "div"
            );

        noResults.id =
            "noResults";

        noResults.className =
            "text-center";


        noResults.style.cssText = `
            padding:50px 20px;
            color:#9ca3af;
            grid-column:1/-1;
        `;


        noResults.innerHTML = `

            <div style="
                font-size:42px;
                margin-bottom:12px;
            ">
                🔍
            </div>

            <h3 style="
                color:#fff;
                margin-bottom:7px;
                font-size:18px;
            ">
                No Tools Found
            </h3>

            <p style="font-size:13px;">
                Try another search or category.
            </p>

        `;


        const grid =
            document.querySelector(
                ".tools-grid"
            );


        if (grid) {

            grid.appendChild(
                noResults
            );

        }

    }


    noResults.style.display =
        "block";

}


// ============================================================
// MAINTENANCE MODE
// ============================================================

function handleMaintenanceState(
    data
) {

    if (
        !data ||
        data.enabled !== true
    ) {

        removeMaintenanceOverlay();

        return;

    }


    showMaintenanceOverlay(
        data
    );

}


// ============================================================
// SHOW MAINTENANCE
// ============================================================

function showMaintenanceOverlay(
    data
) {

    let overlay =
        document.getElementById(
            "zxhMaintenanceOverlay"
        );


    if (!overlay) {

        overlay =
            document.createElement(
                "div"
            );

        overlay.id =
            "zxhMaintenanceOverlay";


        overlay.style.cssText = `
            position:fixed;
            inset:0;
            z-index:999999;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:24px;
            background:
                rgba(3,7,18,.96);
            backdrop-filter:blur(25px);
            color:#fff;
            text-align:center;
        `;


        document.body.appendChild(
            overlay
        );

    }


    const title =
        data.title ||
        "ZXH OFFICIAL TOOLS";


    const message =
        data.message ||
        "Website is currently under maintenance.";


    overlay.innerHTML = `

        <div style="
            width:100%;
            max-width:520px;
            padding:35px 25px;
            border-radius:28px;
            background:rgba(255,255,255,.06);
            border:1px solid rgba(255,255,255,.12);
            box-shadow:0 25px 80px rgba(0,0,0,.45);
        ">

            <div style="
                width:78px;
                height:78px;
                margin:0 auto 22px;
                display:flex;
                align-items:center;
                justify-content:center;
                border-radius:24px;
                background:rgba(124,58,237,.15);
                border:1px solid rgba(124,58,237,.3);
                font-size:35px;
            ">
                🛠️
            </div>

            <h1 style="
                margin:0 0 12px;
                font-size:26px;
            ">
                ${escapeHTML(title)}
            </h1>

            <p style="
                margin:0 auto 25px;
                max-width:430px;
                color:#aeb7c7;
                line-height:1.7;
            ">
                ${escapeHTML(message)}
            </p>

            ${
                data.showButton !== false
                ? `
                    <button
                        id="zxhMaintenanceRefresh"
                        style="
                            border:0;
                            border-radius:14px;
                            padding:13px 24px;
                            cursor:pointer;
                            color:#fff;
                            font-weight:800;
                            background:linear-gradient(
                                135deg,
                                #7c3aed,
                                #2563eb
                            );
                        "
                    >
                        ${escapeHTML(
                            data.buttonText ||
                            "Refresh"
                        )}
                    </button>
                `
                : ""
            }

        </div>

    `;


    const button =
        document.getElementById(
            "zxhMaintenanceRefresh"
        );


    if (button) {

        button.onclick =
            () => window.location.reload();

    }


    document.body.style.overflow =
        "hidden";

}


// ============================================================
// REMOVE MAINTENANCE
// ============================================================

function removeMaintenanceOverlay() {

    const overlay =
        document.getElementById(
            "zxhMaintenanceOverlay"
        );


    if (overlay) {

        overlay.remove();

    }


    if (
        !document.querySelector(
            ".popup-overlay"
        )
    ) {

        document.body.style.overflow =
            "";

    }

}


// ============================================================
// NOTIFICATIONS
// ============================================================

function handleNotifications(
    data
) {

    if (
        !data ||
        !data.active
    ) return;


    const notification =
        data.active;


    if (
        notification.enabled !== true
    ) return;


    const id =
        notification.id ||
        notification.timestamp ||
        "default";


    const storageKey =
        `zxh_notification_${id}`;


    if (
        localStorage.getItem(
            storageKey
        ) === "true"
    ) {

        return;

    }


    showNotification(
        notification
    );


    localStorage.setItem(
        storageKey,
        "true"
    );

}


// ============================================================
// NOTIFICATION POPUP
// ============================================================

function showNotification(
    notification
) {

    const title =
        notification.title ||
        "ZXH OFFICIAL TOOLS";


    const message =
        notification.message ||
        "New notification available.";


    const type =
        notification.type ||
        "info";


    const buttonText =
        notification.buttonText ||
        "Got It";


    const overlay =
        createPopupOverlay();


    overlay.innerHTML = `

        <div
            class="popup-content"
            style="
                max-width:430px;
                width:100%;
                padding:28px;
                border-radius:24px;
                background:rgba(15,23,42,.96);
                border:1px solid rgba(255,255,255,.12);
                color:#fff;
                text-align:center;
                box-shadow:0 30px 100px rgba(0,0,0,.55);
            "
        >

            <button
                class="popup-close-btn"
                style="
                    position:absolute;
                    top:14px;
                    right:14px;
                    width:34px;
                    height:34px;
                    border:0;
                    border-radius:50%;
                    background:rgba(255,255,255,.08);
                    color:#fff;
                    cursor:pointer;
                "
            >
                ✕
            </button>

            <div style="
                width:60px;
                height:60px;
                margin:0 auto 18px;
                border-radius:18px;
                display:flex;
                align-items:center;
                justify-content:center;
                background:rgba(124,58,237,.15);
                border:1px solid rgba(124,58,237,.25);
                font-size:26px;
            ">
                ${
                    type === "success"
                    ? "✅"
                    : type === "warning"
                    ? "⚠️"
                    : type === "error"
                    ? "❌"
                    : "🔔"
                }
            </div>

            <h2 style="
                margin:0 0 10px;
            ">
                ${escapeHTML(title)}
            </h2>

            <p style="
                margin:0 0 22px;
                color:#aeb7c7;
                line-height:1.7;
            ">
                ${escapeHTML(message)}
            </p>

            <button
                class="popup-action"
                style="
                    width:100%;
                    padding:13px;
                    border:0;
                    border-radius:14px;
                    color:#fff;
                    font-weight:800;
                    cursor:pointer;
                    background:linear-gradient(
                        135deg,
                        #7c3aed,
                        #2563eb
                    );
                "
            >
                ${escapeHTML(buttonText)}
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const close =
        () => {

            overlay.remove();

            if (
                !document.getElementById(
                    "zxhMaintenanceOverlay"
                )
            ) {

                document.body.style.overflow =
                    "";

            }

        };


    overlay
        .querySelector(
            ".popup-close-btn"
        )
        ?.addEventListener(
            "click",
            close
        );


    overlay
        .querySelector(
            ".popup-action"
        )
        ?.addEventListener(
            "click",
            close
        );

}


// ============================================================
// POPUP SETTINGS
// ============================================================

function applyPopupSettings() {

    const settings =
        AppState.settings || {};

    const popups =
        AppState.popups || {};


    if (
        settings.popup1Enabled === false
    ) {

        disablePopup(
            "popup1"
        );

    }


    if (
        settings.popup2Enabled === false
    ) {

        disablePopup(
            "popup2"
        );

    }


    if (
        settings.popup3Enabled === false
    ) {

        disablePopup(
            "popup3"
        );

    }


    // Do not automatically display all three.
    // Popup system is controlled by RTDB.
    handlePopups(
        popups
    );

}


// ============================================================
// POPUP HANDLER
// ============================================================

function handlePopups(
    popups
) {

    if (
        !popups ||
        typeof popups !==
        "object"
    ) return;


    const settings =
        AppState.settings || {};


    const popupMap = [
        [
            "popup1",
            settings.popup1Enabled
        ],
        [
            "popup2",
            settings.popup2Enabled
        ],
        [
            "popup3",
            settings.popup3Enabled
        ]
    ];


    for (
        const [id, masterEnabled]
        of popupMap
    ) {

        const popup =
            popups[id];


        if (
            !popup ||
            popup.enabled !== true ||
            masterEnabled === false
        ) {

            continue;

        }


        const storageKey =
            `zxh_popup_${id}_${popup.id || "default"}`;


        if (
            localStorage.getItem(
                storageKey
            ) === "true"
        ) {

            continue;

        }


        setTimeout(
            () => {

                showDatabasePopup(
                    popup
                );

                localStorage.setItem(
                    storageKey,
                    "true"
                );

            },
            id === "popup1"
                ? 1200
                : id === "popup2"
                ? 3500
                : 6000
        );


        // One popup at a time on first load.
        break;

    }

}


// ============================================================
// DATABASE POPUP
// ============================================================

function showDatabasePopup(
    popup
) {

    const overlay =
        createPopupOverlay();


    const type =
        popup.type ||
        "info";


    overlay.innerHTML = `

        <div
            class="popup-content"
            style="
                position:relative;
                max-width:430px;
                width:100%;
                padding:30px;
                border-radius:25px;
                background:rgba(15,23,42,.97);
                border:1px solid rgba(255,255,255,.12);
                color:#fff;
                text-align:center;
                box-shadow:0 30px 100px rgba(0,0,0,.55);
            "
        >

            <button
                class="popup-close-btn"
                style="
                    position:absolute;
                    top:14px;
                    right:14px;
                    width:34px;
                    height:34px;
                    border:0;
                    border-radius:50%;
                    background:rgba(255,255,255,.08);
                    color:#fff;
                    cursor:pointer;
                "
            >
                ✕
            </button>

            <div style="
                width:65px;
                height:65px;
                margin:0 auto 18px;
                border-radius:20px;
                display:flex;
                align-items:center;
                justify-content:center;
                background:rgba(124,58,237,.15);
                font-size:28px;
            ">
                ${
                    type === "success"
                    ? "✅"
                    : type === "warning"
                    ? "⚠️"
                    : type === "error"
                    ? "❌"
                    : "🔔"
                }
            </div>

            <h2 style="
                margin:0 0 12px;
            ">
                ${escapeHTML(
                    popup.title ||
                    "ZXH OFFICIAL TOOLS"
                )}
            </h2>

            <p style="
                margin:0 0 24px;
                color:#aeb7c7;
                line-height:1.7;
            ">
                ${escapeHTML(
                    popup.message ||
                    ""
                )}
            </p>

            <button
                class="popup-action"
                style="
                    width:100%;
                    padding:13px;
                    border:0;
                    border-radius:14px;
                    color:#fff;
                    font-weight:800;
                    cursor:pointer;
                    background:linear-gradient(
                        135deg,
                        #7c3aed,
                        #2563eb
                    );
                "
            >
                ${escapeHTML(
                    popup.buttonText ||
                    "Continue"
                )}
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const close =
        () => {

            overlay.remove();

            if (
                !document.getElementById(
                    "zxhMaintenanceOverlay"
                )
            ) {

                document.body.style.overflow =
                    "";

            }

        };


    overlay
        .querySelector(
            ".popup-close-btn"
        )
        ?.addEventListener(
            "click",
            close
        );


    overlay
        .querySelector(
            ".popup-action"
        )
        ?.addEventListener(
            "click",
            close
        );

}


// ============================================================
// POPUP OVERLAY
// ============================================================

function createPopupOverlay() {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "popup-overlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:999990;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background:rgba(0,0,0,.72);
        backdrop-filter:blur(18px);
    `;


    document.body.style.overflow =
        "hidden";


    return overlay;

}


// ============================================================
// POPUP DISABLE
// ============================================================

function disablePopup(
    id
) {

    const selector =
        `[data-popup="${CSS.escape(id)}"]`;


    document
        .querySelectorAll(
            selector
        )
        .forEach(
            element => {

                element.style.display =
                    "none";

            }
        );

}


// ============================================================
// VIEWS TRACKING
// ============================================================

function setupStatsTracking() {

    const sessionKey =
        "zxh_view_counted_" +
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    if (
        sessionStorage.getItem(
            sessionKey
        ) === "true"
    ) {

        return;

    }


    sessionStorage.setItem(
        sessionKey,
        "true"
    );


    incrementGlobalViews();

}


// ============================================================
// GLOBAL VIEWS
// ============================================================

async function incrementGlobalViews() {

    try {

        const statsRef =
            ref(
                database,
                "stats/views"
            );


        await runTransaction(
            statsRef,
            current => {

                return (
                    Number(
                        current || 0
                    ) + 1
                );

            }
        );

    }
    catch (error) {

        console.warn(
            "View counter failed:",
            error
        );

    }

}


// ============================================================
// TOOL VIEW
// ============================================================

window.ZXH_VIEW_TOOL =
async function (
    toolId
) {

    if (!toolId) return;


    try {

        await runTransaction(
            ref(
                database,
                `tools/${toolId}/views`
            ),
            current =>
                Number(
                    current || 0
                ) + 1
        );

    }
    catch (error) {

        console.warn(
            "Tool view counter failed:",
            error
        );

    }

};


// ============================================================
// GLOBAL LIKE
// ============================================================

window.ZXH_LIKE =
async function () {

    const liked =
        localStorage.getItem(
            "zxh_global_liked"
        ) === "true";


    if (liked) {

        showToast(
            "You already liked ZXH OFFICIAL TOOLS ❤️",
            "info"
        );

        return false;

    }


    try {

        await runTransaction(
            ref(
                database,
                "stats/likes"
            ),
            current =>
                Number(
                    current || 0
                ) + 1
        );


        localStorage.setItem(
            "zxh_global_liked",
            "true"
        );


        showToast(
            "Thanks for your like ❤️",
            "success"
        );


        return true;

    }
    catch (error) {

        console.error(
            "Like failed:",
            error
        );


        showToast(
            "Like failed.",
            "error"
        );


        return false;

    }

};


// ============================================================
// TOOL LIKE
// ============================================================

window.ZXH_LIKE_TOOL =
async function (
    toolId
) {

    if (!toolId) return false;


    const storageKey =
        `zxh_tool_liked_${toolId}`;


    if (
        localStorage.getItem(
            storageKey
        ) === "true"
    ) {

        showToast(
            "You already liked this tool ❤️",
            "info"
        );

        return false;

    }


    try {

        await runTransaction(
            ref(
                database,
                `tools/${toolId}/likes`
            ),
            current =>
                Number(
                    current || 0
                ) + 1
        );


        localStorage.setItem(
            storageKey,
            "true"
        );


        showToast(
            "Tool liked ❤️",
            "success"
        );


        return true;

    }
    catch (error) {

        console.error(
            "Tool like failed:",
            error
        );


        return false;

    }

};


// ============================================================
// PWA INSTALL
// ============================================================

function setupInstallPrompt() {

    window.addEventListener(
        "beforeinstallprompt",
        event => {

            event.preventDefault();

            AppState.deferredInstallPrompt =
                event;


            if (
                !AppState.installPromptDismissed
            ) {

                setTimeout(
                    showInstallPrompt,
                    1800
                );

            }

        }
    );


    window.addEventListener(
        "appinstalled",
        () => {

            AppState.deferredInstallPrompt =
                null;


            hideInstallPrompt();


            localStorage.setItem(
                "zxh_app_installed",
                "true"
            );


            showToast(
                "ZXH Tools installed successfully 🚀",
                "success"
            );

        }
    );

}


// ============================================================
// SHOW INSTALL
// ============================================================

function showInstallPrompt() {

    const overlay =
        document.getElementById(
            "installPromptOverlay"
        );


    if (!overlay) return;


    if (
        isRunningAsInstalledApp()
    ) return;


    overlay.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";


    setupLucide();

}


// ============================================================
// HIDE INSTALL
// ============================================================

function hideInstallPrompt() {

    const overlay =
        document.getElementById(
            "installPromptOverlay"
        );


    if (!overlay) return;


    overlay.style.display =
        "none";


    if (
        !document.getElementById(
            "zxhMaintenanceOverlay"
        )
    ) {

        document.body.style.overflow =
            "";

    }

}


// ============================================================
// DISMISS INSTALL
// ============================================================

window.dismissInstallPrompt =
function () {

    localStorage.setItem(
        "zxh_install_prompt_dismissed",
        "true"
    );


    AppState.installPromptDismissed =
        true;


    hideInstallPrompt();

};


// ============================================================
// INSTALL
// ============================================================

window.triggerInstall =
async function () {

    const promptEvent =
        AppState.deferredInstallPrompt;


    if (!promptEvent) {

        showToast(
            "Install option is not available in this browser.",
            "error"
        );

        return;

    }


    try {

        promptEvent.prompt();


        const result =
            await promptEvent.userChoice;


        console.log(
            "PWA install result:",
            result.outcome
        );


        AppState.deferredInstallPrompt =
            null;


        if (
            result.outcome ===
            "accepted"
        ) {

            hideInstallPrompt();

        }

    }
    catch (error) {

        console.error(
            "Install error:",
            error
        );

    }

};


// ============================================================
// CHECK INSTALLED
// ============================================================

function isRunningAsInstalledApp() {

    return (

        window.matchMedia(
            "(display-mode: standalone)"
        ).matches ||

        window.navigator.standalone ===
            true ||

        document.referrer.includes(
            "android-app://"
        )

    );

}


// ============================================================
// SERVICE WORKER
// ============================================================

function setupPWA() {

    if (
        "serviceWorker" in navigator
    ) {

        window.addEventListener(
            "load",
            async () => {

                try {

                    const registration =
                        await navigator.serviceWorker.register(
                            "./service-worker.js"
                        );


                    console.log(
                        "Service Worker registered:",
                        registration.scope
                    );

                }
                catch (error) {

                    console.warn(
                        "Service Worker registration failed:",
                        error
                    );

                }

            }
        );

    }

}


// ============================================================
// LUCIDE
// ============================================================

function setupLucide() {

    if (
        typeof window.lucide !==
        "undefined"
    ) {

        window.lucide.createIcons();

    }

}


// ============================================================
// GLOBAL EVENTS
// ============================================================

function setupGlobalEvents() {

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    "[data-tool-link]"
                );


            if (!link) return;


            const url =
                link.dataset.toolLink;


            if (!url) return;


            const card =
                link.closest(
                    ".tool-card"
                );


            if (card) {

                const toolId =
                    card.dataset.toolId;


                if (toolId) {

                    ZXH_VIEW_TOOL(
                        toolId
                    );

                }

            }


            // If it's a real anchor,
            // browser handles navigation.
        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                (
                    event.ctrlKey ||
                    event.metaKey
                ) &&
                event.key.toLowerCase() ===
                "k"
            ) {

                event.preventDefault();


                const search =
                    document.getElementById(
                        "toolSearch"
                    );


                if (search) {

                    search.focus();

                }

            }

        }
    );

}


// ============================================================
// TOAST
// ============================================================

window.showToast =
function (
    message,
    type = "info"
) {

    let container =
        document.querySelector(
            ".toast-container"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );


        container.className =
            "toast-container";


        container.style.cssText = `
            position:fixed;
            right:18px;
            bottom:18px;
            z-index:999999;
            display:flex;
            flex-direction:column;
            gap:10px;
            max-width:360px;
        `;


        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast ${type}`;


    toast.style.cssText = `
        display:flex;
        align-items:center;
        gap:10px;
        padding:12px 15px;
        border-radius:14px;
        color:#fff;
        background:rgba(15,23,42,.96);
        border:1px solid rgba(255,255,255,.12);
        box-shadow:0 15px 40px rgba(0,0,0,.35);
        transition:
            opacity .3s ease,
            transform .3s ease;
    `;


    const icon =
        type === "success"
            ? "✓"
            : type === "error"
            ? "!"
            : "i";


    toast.innerHTML = `

        <div style="
            width:28px;
            height:28px;
            flex:none;
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:9px;
            background:rgba(255,255,255,.08);
            font-weight:900;
        ">
            ${icon}
        </div>

        <div>
            ${escapeHTML(message)}
        </div>

    `;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";


            toast.style.transform =
                "translateX(30px)";


            setTimeout(
                () =>
                    toast.remove(),
                300
            );

        },
        3500
    );

};


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


// ============================================================
// ESCAPE ATTRIBUTE
// ============================================================

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


// ============================================================
// PUBLIC ZXH API
// ============================================================

window.ZXH = {

    firebaseApp,

    database,

    state:
        AppState,

    defaultData:
        DEFAULT_DATA,

    initialize:
        initializeZXH,

    seed:
        seedMissingDatabaseData,

    reload:
        loadDatabaseSnapshot,

    filterTools,

    renderTools,

    renderMenu,

    applySiteSettings,

    applyStats,

    showInstallPrompt,

    hideInstallPrompt,

    showToast,

    like:
        window.ZXH_LIKE,

    likeTool:
        window.ZXH_LIKE_TOOL,

    viewTool:
        window.ZXH_VIEW_TOOL

};


// ============================================================
// STARTUP LOG
// ============================================================

console.log(
    "%cZXH OFFICIAL TOOLS 🚀",
    "font-size:18px;font-weight:900;color:#8b5cf6"
);

console.log(
    "%cRealtime Database Mode: ACTIVE",
    "font-size:13px;font-weight:800;color:#22c55e"
);

console.log(
    "%cFirestore: NOT USED",
    "font-size:13px;font-weight:800;color:#ef4444"
);