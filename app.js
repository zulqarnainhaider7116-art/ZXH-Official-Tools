// ============================================================
// ZXH OFFICIAL TOOLS
// APP.JS
// FIREBASE REALTIME DATABASE VERSION
// ============================================================

"use strict";


// ============================================================
// GLOBAL STATE
// ============================================================

const AppState = {

    db: null,

    rootRef: null,

    tools: [],

    menu: [],

    settings: {},

    stats: {
        views: 0,
        likes: 0
    },

    popups: {},

    notifications: {},

    maintenance: {},

    currentCategory: "all",

    searchQuery: "",

    deferredInstallPrompt: null,

    installPromptDismissed:
        localStorage.getItem(
            "zxh_install_prompt_dismissed"
        ) === "true",

    initialized: false

};


// ============================================================
// FIREBASE CHECK
// ============================================================

function initializeFirebase() {

    try {

        if (
            typeof firebase === "undefined"
        ) {

            throw new Error(
                "Firebase SDK is not loaded."
            );

        }


        if (
            !firebase.apps ||
            !firebase.apps.length
        ) {

            throw new Error(
                "Firebase app is not initialized."
            );

        }


        AppState.db =
            firebase.database();


        AppState.rootRef =
            AppState.db.ref(
                "zxhofficial"
            );


        console.log(
            "%c🔥 ZXH FIREBASE CONNECTED",
            "background:#7c3aed;color:#fff;padding:7px 12px;border-radius:8px;font-weight:900"
        );


        console.log(
            "📡 Database:",
            firebase.app().options.databaseURL
        );


        console.log(
            "📁 Root:",
            "zxhofficial"
        );


        return true;

    }

    catch (error) {

        console.error(
            "❌ Firebase initialization error:",
            error
        );

        showToast(
            "Firebase connection failed.",
            "error"
        );

        return false;

    }

}


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startApp();

    }
);


// ============================================================
// START APP
// ============================================================

async function startApp() {

    console.log(
        "%c☠️ ZXH OFFICIAL TOOLS STARTING...",
        "font-size:18px;font-weight:900;color:#8b5cf6"
    );


    const firebaseOK =
        initializeFirebase();


    if (!firebaseOK) {

        return;

    }


    setupLucide();

    setupSearch();

    setupCategories();

    setupGlobalEvents();

    setupPWA();

    setupInstallPrompt();

    setupRealtimeDatabase();


    AppState.initialized =
        true;


    console.log(
        "%c🚀 ZXH OFFICIAL TOOLS READY",
        "font-size:18px;font-weight:900;color:#8b5cf6"
    );

}


// ============================================================
// REALTIME DATABASE
// ============================================================

function setupRealtimeDatabase() {

    if (
        !AppState.rootRef
    ) {

        console.error(
            "Root Firebase reference unavailable."
        );

        return;

    }


    console.log(
        "📡 Starting Realtime Database listeners..."
    );


    // --------------------------------------------------------
    // SETTINGS
    // --------------------------------------------------------

    AppState.rootRef
        .child("settings")
        .on(
            "value",
            (snapshot) => {

                const data =
                    snapshot.val() || {};

                AppState.settings =
                    data;

                console.log(
                    "⚙️ Settings loaded:",
                    data
                );

                applySettings(
                    data
                );

            },
            handleFirebaseError
        );


    // --------------------------------------------------------
    // TOOLS
    // --------------------------------------------------------

    AppState.rootRef
        .child("tools")
        .on(
            "value",
            (snapshot) => {

                const data =
                    snapshot.val() || {};

                console.log(
                    "🛠️ Tools raw data:",
                    data
                );

                loadTools(
                    data
                );

            },
            handleFirebaseError
        );


    // --------------------------------------------------------
    // MENU
    // --------------------------------------------------------

    AppState.rootRef
        .child("menu")
        .on(
            "value",
            (snapshot) => {

                const data =
                    snapshot.val() || {};

                AppState.menu =
                    normalizeObject(
                        data
                    );

                console.log(
                    "📂 Menu loaded:",
                    AppState.menu
                );

                renderMenu(
                    AppState.menu
                );

            },
            handleFirebaseError
        );


    // --------------------------------------------------------
    // STATS
    // --------------------------------------------------------

    AppState.rootRef
        .child("stats")
        .on(
            "value",
            (snapshot) => {

                const data =
                    snapshot.val() || {};

                AppState.stats = {

                    views:
                        Number(
                            data.views || 0
                        ),

                    likes:
                        Number(
                            data.likes || 0
                        )

                };


                console.log(
                    "📊 Stats loaded:",
                    AppState.stats
                );


                updateStatsUI(
                    AppState.stats
                );

            },
            handleFirebaseError
        );


    // --------------------------------------------------------
    // POPUPS
    // --------------------------------------------------------

    AppState.rootRef
        .child("popups")
        .on(
            "value",
            (snapshot) => {

                const data =
                    snapshot.val() || {};

                AppState.popups =
                    data;

                console.log(
                    "📢 Popups loaded:",
                    data
                );

                handlePopups(
                    data
                );

            },
            handleFirebaseError
        );


    // --------------------------------------------------------
    // NOTIFICATIONS
    // --------------------------------------------------------

    AppState.rootRef
        .child("notifications")
        .on(
            "value",
            (snapshot) => {

                const data =
                    snapshot.val() || {};

                AppState.notifications =
                    data;

                console.log(
                    "🔔 Notifications loaded:",
                    data
                );

                handleNotifications(
                    data
                );

            },
            handleFirebaseError
        );


    // --------------------------------------------------------
    // MAINTENANCE
    // --------------------------------------------------------

    AppState.rootRef
        .child("maintenance")
        .on(
            "value",
            (snapshot) => {

                const data =
                    snapshot.val() || {};

                AppState.maintenance =
                    data;

                console.log(
                    "🔧 Maintenance loaded:",
                    data
                );

                handleMaintenance(
                    data
                );

            },
            handleFirebaseError
        );

}


// ============================================================
// FIREBASE ERROR
// ============================================================

function handleFirebaseError(
    error
) {

    console.error(
        "❌ Firebase Realtime Database error:",
        error
    );

    if (
        error &&
        error.code ===
        "PERMISSION_DENIED"
    ) {

        showToast(
            "Firebase permission denied. Check Realtime Database Rules.",
            "error"
        );

    }

}


// ============================================================
// NORMALIZE FIREBASE OBJECT
// ============================================================

function normalizeObject(
    data
) {

    if (
        !data
    ) {

        return [];

    }


    if (
        Array.isArray(data)
    ) {

        return data
            .filter(Boolean);

    }


    return Object.entries(
        data
    )
    .map(
        ([id, value]) => {

            if (
                value &&
                typeof value === "object"
            ) {

                return {

                    id,

                    ...value

                };

            }


            return {

                id,

                value

            };

        }
    );

}


// ============================================================
// LOAD TOOLS
// ============================================================

function loadTools(
    data
) {

    const tools =
        normalizeObject(
            data
        );


    AppState.tools =
        tools
            .sort(
                (a, b) =>
                    Number(
                        a.order || 999999
                    ) -
                    Number(
                        b.order || 999999
                    )
            );


    console.log(
        `✅ ${AppState.tools.length} tools loaded from Realtime Database.`
    );


    renderTools(
        AppState.tools
    );

}


// ============================================================
// RENDER TOOLS
// ============================================================

function renderTools(
    tools
) {

    const grid =
        document.querySelector(
            ".tools-grid"
        );


    if (!grid) {

        console.warn(
            "⚠️ .tools-grid not found in index.html"
        );

        return;

    }


    grid.innerHTML = "";


    if (
        !tools.length
    ) {

        grid.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:60px 20px;
                    color:#9ca3af;
                "
            >

                <div
                    style="
                        font-size:50px;
                        margin-bottom:15px;
                    "
                >
                    🛠️
                </div>

                <h3
                    style="
                        color:#fff;
                        margin:0 0 8px;
                    "
                >
                    No Tools Available
                </h3>

                <p>
                    No tools were found in Firebase.
                </p>

            </div>

        `;

        return;

    }


    tools.forEach(
        (tool) => {

            const card =
                createToolCard(
                    tool
                );

            grid.appendChild(
                card
            );

        }
    );


    setupLucide();

    filterTools();

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


    card.dataset.name =
        tool.name || "";


    card.dataset.description =
        tool.description || "";


    card.dataset.category =
        String(
            tool.category || "all"
        ).toLowerCase();


    const name =
        escapeHTML(
            tool.name ||
            "ZXH Tool"
        );


    const description =
        escapeHTML(
            tool.description ||
            "Premium ZXH OFFICIAL tool."
        );


    const icon =
        escapeAttribute(
            tool.icon ||
            tool.image ||
            tool.logo ||
            ""
        );


    const link =
        escapeAttribute(
            tool.link ||
            tool.url ||
            "#"
        );


    const iconHTML =
        icon

            ? `
                <img
                    src="${icon}"
                    alt="${name}"
                    loading="lazy"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='flex';
                    "
                >

                <span
                    style="
                        display:none;
                        align-items:center;
                        justify-content:center;
                        width:100%;
                        height:100%;
                        font-size:30px;
                    "
                >
                    🛠️
                </span>
            `

            : `
                <span
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        width:100%;
                        height:100%;
                        font-size:30px;
                    "
                >
                    🛠️
                </span>
            `;


    card.innerHTML = `

        <div class="tool-icon">

            ${iconHTML}

        </div>


        <div class="tool-info">

            <h3>
                ${name}
            </h3>

            <p>
                ${description}
            </p>

        </div>


        <div class="tool-actions">

            <a
                href="${link}"
                class="btn-premium"
                data-tool-link="${link}"
            >
                Open Tool
            </a>

        </div>

    `;


    return card;

}


// ============================================================
// SETTINGS
// ============================================================

function applySettings(
    settings
) {

    if (!settings) return;


    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    if (
        settings.siteTitle
    ) {

        document.title =
            settings.siteTitle;

    }


    // --------------------------------------------------------
    // DESCRIPTION
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
    // LOGO
    // --------------------------------------------------------

    if (
        settings.logoUrl
    ) {

        document
            .querySelectorAll(
                "[data-site-logo], .site-logo img, .logo img"
            )
            .forEach(
                (img) => {

                    img.src =
                        settings.logoUrl;

                }
            );

    }


    // --------------------------------------------------------
    // SITE TITLE ELEMENTS
    // --------------------------------------------------------

    document
        .querySelectorAll(
            "[data-site-title]"
        )
        .forEach(
            (element) => {

                element.textContent =
                    settings.siteTitle ||
                    "ZXH OFFICIAL TOOLS";

            }
        );


    // --------------------------------------------------------
    // FOOTER
    // --------------------------------------------------------

    if (
        settings.footerText
    ) {

        document
            .querySelectorAll(
                "[data-footer-text]"
            )
            .forEach(
                (element) => {

                    element.textContent =
                        settings.footerText;

                }
            );

    }


    // --------------------------------------------------------
    // CONTACT LINKS
    // --------------------------------------------------------

    if (
        settings.contactWhatsapp
    ) {

        document
            .querySelectorAll(
                "[data-contact-whatsapp]"
            )
            .forEach(
                (element) => {

                    element.href =
                        settings.contactWhatsapp;

                }
            );

    }


    if (
        settings.whatsappChannel
    ) {

        document
            .querySelectorAll(
                "[data-whatsapp-channel]"
            )
            .forEach(
                (element) => {

                    element.href =
                        settings.whatsappChannel;

                }
            );

    }


    if (
        settings.whatsappGroup
    ) {

        document
            .querySelectorAll(
                "[data-whatsapp-group]"
            )
            .forEach(
                (element) => {

                    element.href =
                        settings.whatsappGroup;

                }
            );

    }

}


// ============================================================
// MENU
// ============================================================

function renderMenu(
    menu
) {

    if (!menu.length) {

        console.warn(
            "⚠️ No menu items found."
        );

        return;

    }


    const containers =
        document.querySelectorAll(
            "[data-menu]"
        );


    containers.forEach(
        (container) => {

            container.innerHTML = "";


            menu.forEach(
                (item) => {

                    const element =
                        document.createElement(
                            "a"
                        );


                    element.href =
                        item.link ||
                        "#";


                    element.className =
                        "menu-item";


                    element.dataset.category =
                        item.category ||
                        "";


                    if (
                        item.category
                    ) {

                        element.addEventListener(
                            "click",
                            (event) => {

                                event.preventDefault();

                                AppState.currentCategory =
                                    item.category;

                                document
                                    .querySelectorAll(
                                        "[data-category]"
                                    )
                                    .forEach(
                                        (button) => {

                                            button.classList.remove(
                                                "active"
                                            );

                                        }
                                    );


                                filterTools();

                            }
                        );

                    }


                    element.innerHTML = `

                        ${
                            item.icon
                                ? `<i class="${escapeAttribute(item.icon)}"></i>`
                                : ""
                        }

                        <span>
                            ${escapeHTML(item.label || item.id || "Menu")}
                        </span>

                    `;


                    container.appendChild(
                        element
                    );

                }
            );

        }
    );

}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const input =
        document.getElementById(
            "toolSearch"
        );


    if (!input) {

        console.warn(
            "⚠️ #toolSearch not found."
        );

        return;

    }


    input.addEventListener(
        "input",
        (event) => {

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
        (event) => {

            const button =
                event.target.closest(
                    "[data-category]"
                );


            if (!button) return;


            const category =
                button.dataset.category ||
                "all";


            AppState.currentCategory =
                category.toLowerCase();


            document
                .querySelectorAll(
                    "[data-category]"
                )
                .forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
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


    let visible =
        0;


    cards.forEach(
        (card) => {

            const name =
                (
                    card.dataset.name ||
                    ""
                ).toLowerCase();


            const description =
                (
                    card.dataset.description ||
                    ""
                ).toLowerCase();


            const cardCategory =
                (
                    card.dataset.category ||
                    "all"
                ).toLowerCase();


            const searchMatch =
                !query ||
                name.includes(query) ||
                description.includes(query);


            const categoryMatch =
                category === "all" ||
                cardCategory === category;


            const show =
                searchMatch &&
                categoryMatch;


            card.style.display =
                show
                    ? ""
                    : "none";


            if (show) {

                visible++;

            }

        }
    );


    updateNoResults(
        visible
    );

}


// ============================================================
// NO RESULTS
// ============================================================

function updateNoResults(
    count
) {

    let element =
        document.getElementById(
            "noResults"
        );


    if (
        count > 0
    ) {

        if (element) {

            element.remove();

        }

        return;

    }


    const grid =
        document.querySelector(
            ".tools-grid"
        );


    if (!grid) return;


    if (!element) {

        element =
            document.createElement(
                "div"
            );


        element.id =
            "noResults";


        element.style.cssText = `
            grid-column:1/-1;
            text-align:center;
            padding:50px 20px;
            color:#9ca3af;
        `;


        element.innerHTML = `

            <div
                style="
                    font-size:45px;
                    margin-bottom:12px;
                "
            >
                🔍
            </div>

            <h3
                style="
                    color:#fff;
                    margin:0 0 7px;
                "
            >
                No Tools Found
            </h3>

            <p>
                Try another search or category.
            </p>

        `;


        grid.appendChild(
            element
        );

    }

}


// ============================================================
// STATS
// ============================================================

function updateStatsUI(
    stats
) {

    document
        .querySelectorAll(
            "[data-stat='views'], #totalViews, .total-views"
        )
        .forEach(
            (element) => {

                element.textContent =
                    formatNumber(
                        stats.views
                    );

            }
        );


    document
        .querySelectorAll(
            "[data-stat='likes'], #totalLikes, .total-likes"
        )
        .forEach(
            (element) => {

                element.textContent =
                    formatNumber(
                        stats.likes
                    );

            }
        );

}


// ============================================================
// INCREMENT VIEWS
// ============================================================

window.incrementViews =
async function () {

    if (
        !AppState.rootRef
    ) return;


    try {

        await AppState.rootRef
            .child("stats")
            .child("views")
            .transaction(
                (current) => {

                    return (
                        Number(
                            current || 0
                        ) + 1
                    );

                }
            );


        console.log(
            "👁️ View counted."
        );

    }

    catch (error) {

        console.error(
            "View increment failed:",
            error
        );

    }

};


// ============================================================
// INCREMENT LIKES
// ============================================================

window.incrementLikes =
async function () {

    if (
        !AppState.rootRef
    ) return;


    try {

        await AppState.rootRef
            .child("stats")
            .child("likes")
            .transaction(
                (current) => {

                    return (
                        Number(
                            current || 0
                        ) + 1
                    );

                }
            );


        console.log(
            "❤️ Like counted."
        );


        showToast(
            "Liked successfully ❤️",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Like increment failed:",
            error
        );

    }

};


// ============================================================
// AUTOMATIC PAGE VIEW
// ============================================================

function setupAutomaticView() {

    const sessionKey =
        "zxh_view_counted";


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


    incrementViews();

}


// ============================================================
// POPUPS
// ============================================================

function handlePopups(
    data
) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        return;

    }


    const enabledPopups =
        Object.entries(
            data
        )
        .filter(
            ([, popup]) =>
                popup &&
                popup.enabled === true
        )
        .sort(
            ([, a], [, b]) =>
                Number(
                    a.order || 999
                ) -
                Number(
                    b.order || 999
                )
        );


    if (
        !enabledPopups.length
    ) {

        return;

    }


    enabledPopups.forEach(
        ([id, popup], index) => {

            const shownKey =
                `zxh_popup_${id}_${popup.id || "v1"}`;


            if (
                localStorage.getItem(
                    shownKey
                ) === "true"
            ) {

                return;

            }


            setTimeout(
                () => {

                    showPopup(
                        popup,
                        shownKey
                    );

                },
                1200 +
                (
                    index * 900
                )
            );

        }
    );

}


// ============================================================
// SHOW POPUP
// ============================================================

function showPopup(
    popup,
    shownKey
) {

    if (
        document.querySelector(
            ".zxh-popup-overlay"
        )
    ) {

        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "zxh-popup-overlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:99999;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background:rgba(0,0,0,.72);
        backdrop-filter:blur(12px);
    `;


    const title =
        escapeHTML(
            popup.title ||
            "ZXH OFFICIAL"
        );


    const message =
        escapeHTML(
            popup.message ||
            popup.description ||
            "New update available."
        );


    overlay.innerHTML = `

        <div
            style="
                width:min(500px,100%);
                padding:28px;
                border-radius:24px;
                color:#fff;
                background:rgba(20,20,30,.96);
                border:1px solid rgba(255,255,255,.12);
                box-shadow:0 25px 80px rgba(0,0,0,.45);
                position:relative;
                text-align:center;
            "
        >

            <button
                class="zxh-popup-close"
                style="
                    position:absolute;
                    top:12px;
                    right:14px;
                    width:35px;
                    height:35px;
                    border:0;
                    border-radius:50%;
                    background:rgba(255,255,255,.08);
                    color:#fff;
                    cursor:pointer;
                    font-size:18px;
                "
            >
                ×
            </button>


            ${
                popup.image
                    ? `
                        <img
                            src="${escapeAttribute(popup.image)}"
                            alt=""
                            style="
                                width:100%;
                                max-height:220px;
                                object-fit:cover;
                                border-radius:16px;
                                margin-bottom:18px;
                            "
                        >
                    `
                    : `
                        <div
                            style="
                                font-size:45px;
                                margin-bottom:15px;
                            "
                        >
                            📢
                        </div>
                    `
            }


            <h2
                style="
                    margin:0 0 10px;
                    font-size:22px;
                "
            >
                ${title}
            </h2>


            <p
                style="
                    margin:0 0 22px;
                    line-height:1.7;
                    color:#b8bdc9;
                "
            >
                ${message}
            </p>


            <button
                class="zxh-popup-ok"
                style="
                    width:100%;
                    padding:14px;
                    border:0;
                    border-radius:14px;
                    background:linear-gradient(135deg,#7c3aed,#2563eb);
                    color:#fff;
                    font-weight:800;
                    cursor:pointer;
                "
            >
                ${escapeHTML(
                    popup.buttonText ||
                    "Got It"
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

            document.body.style.overflow =
                "";


            if (
                shownKey
            ) {

                localStorage.setItem(
                    shownKey,
                    "true"
                );

            }

        };


    overlay
        .querySelector(
            ".zxh-popup-close"
        )
        .addEventListener(
            "click",
            close
        );


    overlay
        .querySelector(
            ".zxh-popup-ok"
        )
        .addEventListener(
            "click",
            close
        );


    document.body.style.overflow =
        "hidden";

}


// ============================================================
// NOTIFICATIONS
// ============================================================

function handleNotifications(
    data
) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        return;

    }


    let notification =
        data.active;


    if (
        !notification
    ) {

        const items =
            normalizeObject(
                data
            );


        notification =
            items.find(
                (item) =>
                    item.enabled === true
            );

    }


    if (
        !notification ||
        notification.enabled !== true
    ) {

        return;

    }


    const id =
        notification.id ||
        notification.timestamp ||
        "default";


    const key =
        `zxh_notification_${id}`;


    if (
        localStorage.getItem(
            key
        ) === "true"
    ) {

        return;

    }


    setTimeout(
        () => {

            showNotification(
                notification,
                key
            );

        },
        1800
    );

}


// ============================================================
// SHOW NOTIFICATION
// ============================================================

function showNotification(
    notification,
    key
) {

    if (
        document.querySelector(
            ".zxh-notification-overlay"
        )
    ) {

        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "zxh-notification-overlay";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:99998;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background:rgba(0,0,0,.7);
        backdrop-filter:blur(10px);
    `;


    const type =
        notification.type ||
        "info";


    const icon =
        type === "success"
            ? "✅"
            : type === "warning"
            ? "⚠️"
            : type === "error"
            ? "❌"
            : "🔔";


    overlay.innerHTML = `

        <div
            style="
                width:min(480px,100%);
                padding:28px;
                border-radius:24px;
                background:rgba(20,20,30,.97);
                border:1px solid rgba(255,255,255,.12);
                color:#fff;
                text-align:center;
                box-shadow:0 25px 80px rgba(0,0,0,.5);
            "
        >

            <div
                style="
                    width:65px;
                    height:65px;
                    margin:0 auto 17px;
                    border-radius:20px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:rgba(124,58,237,.15);
                    font-size:30px;
                "
            >
                ${icon}
            </div>


            <h2
                style="
                    margin:0 0 10px;
                "
            >
                ${escapeHTML(
                    notification.title ||
                    "ZXH OFFICIAL TOOLS"
                )}
            </h2>


            <p
                style="
                    color:#b8bdc9;
                    line-height:1.7;
                    margin:0 0 22px;
                "
            >
                ${escapeHTML(
                    notification.message ||
                    "New notification available."
                )}
            </p>


            <button
                class="zxh-notification-close"
                style="
                    width:100%;
                    padding:14px;
                    border:0;
                    border-radius:14px;
                    background:linear-gradient(135deg,#7c3aed,#2563eb);
                    color:#fff;
                    font-weight:800;
                    cursor:pointer;
                "
            >
                ${escapeHTML(
                    notification.buttonText ||
                    "Got It"
                )}
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    overlay
        .querySelector(
            ".zxh-notification-close"
        )
        .addEventListener(
            "click",
            () => {

                overlay.remove();

                localStorage.setItem(
                    key,
                    "true"
                );

            }
        );

}


// ============================================================
// MAINTENANCE
// ============================================================

function handleMaintenance(
    data
) {

    if (
        !data ||
        data.enabled !== true
    ) {

        removeMaintenanceScreen();

        return;

    }


    showMaintenanceScreen(
        data
    );

}


// ============================================================
// SHOW MAINTENANCE
// ============================================================

function showMaintenanceScreen(
    data
) {

    if (
        document.getElementById(
            "zxhMaintenanceScreen"
        )
    ) {

        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "zxhMaintenanceScreen";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:100000;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:25px;
        background:#05070d;
        color:#fff;
        text-align:center;
    `;


    overlay.innerHTML = `

        <div
            style="
                width:min(600px,100%);
            "
        >

            <div
                style="
                    font-size:65px;
                    margin-bottom:20px;
                "
            >
                🔧
            </div>


            <h1
                style="
                    font-size:30px;
                    margin:0 0 14px;
                "
            >
                ${escapeHTML(
                    data.title ||
                    "Maintenance Mode"
                )}
            </h1>


            <p
                style="
                    color:#aeb4c2;
                    line-height:1.8;
                    margin:0 auto 20px;
                    max-width:500px;
                "
            >
                ${escapeHTML(
                    data.message ||
                    "ZXH OFFICIAL TOOLS is currently under maintenance. Please try again later."
                )}
            </p>


            ${
                data.showContact === true
                    ? `
                        <a
                            href="${escapeAttribute(
                                AppState.settings.contactWhatsapp ||
                                "#"
                            )}"
                            target="_blank"
                            rel="noopener"
                            style="
                                display:inline-block;
                                padding:13px 22px;
                                border-radius:14px;
                                background:#25d366;
                                color:#fff;
                                text-decoration:none;
                                font-weight:800;
                            "
                        >
                            Contact Owner
                        </a>
                    `
                    : ""
            }

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    document.body.style.overflow =
        "hidden";

}


// ============================================================
// REMOVE MAINTENANCE
// ============================================================

function removeMaintenanceScreen() {

    const element =
        document.getElementById(
            "zxhMaintenanceScreen"
        );


    if (
        element
    ) {

        element.remove();

        document.body.style.overflow =
            "";

    }

}


// ============================================================
// GLOBAL EVENTS
// ============================================================

function setupGlobalEvents() {

    document.addEventListener(
        "click",
        (event) => {

            const link =
                event.target.closest(
                    "[data-tool-link]"
                );


            if (!link) return;


            const url =
                link.dataset.toolLink;


            if (
                !url ||
                url === "#"
            ) {

                return;

            }


            event.preventDefault();


            window.location.href =
                url;

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

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


                if (
                    search
                ) {

                    search.focus();

                }

            }

        }
    );

}


// ============================================================
// PWA INSTALL
// ============================================================

function setupInstallPrompt() {

    window.addEventListener(
        "beforeinstallprompt",
        (event) => {

            event.preventDefault();


            AppState.deferredInstallPrompt =
                event;


            console.log(
                "📲 PWA installation available."
            );


            if (
                !AppState.installPromptDismissed
            ) {

                setTimeout(
                    () => {

                        showInstallPrompt();

                    },
                    2000
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
    ) {

        return;

    }


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


    document.body.style.overflow =
        "";

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
// TRIGGER INSTALL
// ============================================================

window.triggerInstall =
async function () {

    const prompt =
        AppState.deferredInstallPrompt;


    if (!prompt) {

        showToast(
            "Install option is not available in this browser.",
            "error"
        );

        return;

    }


    try {

        prompt.prompt();


        const result =
            await prompt.userChoice;


        console.log(
            "📲 Install result:",
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
// PWA
// ============================================================

function setupPWA() {

    if (
        !("serviceWorker" in navigator)
    ) {

        return;

    }


    window.addEventListener(
        "load",
        async () => {

            try {

                const registration =
                    await navigator.serviceWorker.register(
                        "./service-worker.js"
                    );


                console.log(
                    "⚙️ Service Worker:",
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


// ============================================================
// INSTALLED APP CHECK
// ============================================================

function isRunningAsInstalledApp() {

    return (

        window.matchMedia(
            "(display-mode: standalone)"
        ).matches ||

        window.navigator.standalone === true ||

        document.referrer.includes(
            "android-app://"
        )

    );

}


// ============================================================
// LUCIDE
// ============================================================

function setupLucide() {

    if (
        typeof window.lucide !==
        "undefined"
    ) {

        try {

            window.lucide.createIcons();

        }

        catch (error) {

            console.warn(
                "Lucide error:",
                error
            );

        }

    }

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
            right:20px;
            bottom:20px;
            z-index:200000;
            display:flex;
            flex-direction:column;
            gap:10px;
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
        min-width:260px;
        max-width:360px;
        padding:13px 16px;
        border-radius:14px;
        background:rgba(20,20,30,.96);
        border:1px solid rgba(255,255,255,.12);
        color:#fff;
        box-shadow:0 15px 40px rgba(0,0,0,.35);
        transition:.3s ease;
    `;


    const icon =
        type === "success"
            ? "✓"
            : type === "error"
            ? "!"
            : "i";


    toast.innerHTML = `

        <div
            style="
                width:28px;
                height:28px;
                display:flex;
                align-items:center;
                justify-content:center;
                border-radius:9px;
                background:rgba(255,255,255,.08);
                font-weight:900;
            "
        >
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
                () => {

                    toast.remove();

                },
                300
            );

        },
        3500
    );

};


// ============================================================
// FORMAT NUMBER
// ============================================================

function formatNumber(
    number
) {

    return Number(
        number || 0
    ).toLocaleString();

}


// ============================================================
// HTML ESCAPE
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
// ATTRIBUTE ESCAPE
// ============================================================

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


// ============================================================
// EXPOSE ZXH API
// ============================================================

window.ZXH = {

    firebase:
        typeof firebase !==
        "undefined"
            ? firebase
            : null,

    db:
        AppState.db,

    rootRef:
        AppState.rootRef,

    state:
        AppState,

    getTools:
        () =>
            AppState.tools,

    getSettings:
        () =>
            AppState.settings,

    getStats:
        () =>
            AppState.stats,

    incrementViews,

    incrementLikes,

    filterTools,

    showToast

};


// ============================================================
// START VIEW COUNTER AFTER DATABASE IS READY
// ============================================================

setTimeout(
    () => {

        if (
            AppState.initialized
        ) {

            setupAutomaticView();

        }

    },
    1500
);


// ============================================================
// DEBUG
// ============================================================

window.ZXH_DEBUG =
function () {

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log(
        "☠️ ZXH OFFICIAL DEBUG"
    );

    console.log(
        "Firebase:",
        AppState.db
    );

    console.log(
        "Root:",
        AppState.rootRef
    );

    console.log(
        "Tools:",
        AppState.tools
    );

    console.log(
        "Settings:",
        AppState.settings
    );

    console.log(
        "Menu:",
        AppState.menu
    );

    console.log(
        "Stats:",
        AppState.stats
    );

    console.log(
        "Popups:",
        AppState.popups
    );

    console.log(
        "Notifications:",
        AppState.notifications
    );

    console.log(
        "Maintenance:",
        AppState.maintenance
    );

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

};


// ============================================================
// FINAL
// ============================================================

console.log(
    "%cZXH OFFICIAL TOOLS ☠️😈🚀",
    "font-size:20px;font-weight:900;color:#8b5cf6"
);

console.log(
    "📡 Waiting for Firebase Realtime Database..."
);