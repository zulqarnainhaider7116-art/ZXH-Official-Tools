// ============================================================
// ZXH OFFICIAL TOOLS
// APP.JS
// FIREBASE REALTIME DATABASE EDITION
// ============================================================

"use strict";

// ============================================================
// FIREBASE MODULAR SDK
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    get,
    set,
    update,
    push,
    transaction
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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
        "%c🔥 ZXH FIREBASE INITIALIZED",
        "background:#7c3aed;color:#fff;padding:7px 12px;border-radius:7px;font-weight:900"
    );

    console.log(
        "📡 Realtime Database:",
        firebaseConfig.databaseURL
    );

} catch (error) {

    console.error(
        "❌ Firebase initialization failed:",
        error
    );

}


// ============================================================
// DATABASE ROOT
// ============================================================

const DB_PATHS = {

    tools:
        "tools",

    menu:
        "menu",

    settings:
        "settings",

    stats:
        "stats",

    popups:
        "popups",

    notifications:
        "notifications",

    maintenance:
        "maintenance"

};


// ============================================================
// GLOBAL APP STATE
// ============================================================

const AppState = {

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

    currentCategory:
        "all",

    searchQuery:
        "",

    deferredInstallPrompt:
        null,

    installPromptDismissed:
        localStorage.getItem(
            "zxh_install_prompt_dismissed"
        ) === "true",

    initialized:
        false

};


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initApp();

    }
);


// ============================================================
// MAIN INITIALIZATION
// ============================================================

async function initApp() {

    console.log(
        "🚀 Initializing ZXH OFFICIAL TOOLS..."
    );

    setupLucide();

    setupSearch();

    setupCategories();

    setupGlobalEvents();

    setupInstallPrompt();

    setupPWA();

    setupFirebase();

    AppState.initialized =
        true;

}


// ============================================================
// FIREBASE SETUP
// ============================================================

function setupFirebase() {

    if (!database) {

        console.error(
            "❌ Realtime Database unavailable."
        );

        showToast(
            "Firebase connection failed.",
            "error"
        );

        return;

    }


    // ========================================================
    // TOOLS
    // ========================================================

    onValue(
        ref(
            database,
            DB_PATHS.tools
        ),
        (snapshot) => {

            const data =
                snapshot.val();

            loadTools(
                data
            );

        },
        (error) => {

            console.error(
                "Tools listener error:",
                error
            );

        }
    );


    // ========================================================
    // MENU
    // ========================================================

    onValue(
        ref(
            database,
            DB_PATHS.menu
        ),
        (snapshot) => {

            const data =
                snapshot.val();

            loadMenu(
                data
            );

        },
        (error) => {

            console.error(
                "Menu listener error:",
                error
            );

        }
    );


    // ========================================================
    // SETTINGS
    // ========================================================

    onValue(
        ref(
            database,
            DB_PATHS.settings
        ),
        (snapshot) => {

            const data =
                snapshot.val();

            loadSettings(
                data
            );

        },
        (error) => {

            console.error(
                "Settings listener error:",
                error
            );

        }
    );


    // ========================================================
    // STATS
    // ========================================================

    onValue(
        ref(
            database,
            DB_PATHS.stats
        ),
        (snapshot) => {

            const data =
                snapshot.val();

            loadStats(
                data
            );

        },
        (error) => {

            console.error(
                "Stats listener error:",
                error
            );

        }
    );


    // ========================================================
    // POPUPS
    // ========================================================

    onValue(
        ref(
            database,
            DB_PATHS.popups
        ),
        (snapshot) => {

            const data =
                snapshot.val();

            loadPopups(
                data
            );

        },
        (error) => {

            console.error(
                "Popups listener error:",
                error
            );

        }
    );


    // ========================================================
    // NOTIFICATIONS
    // ========================================================

    onValue(
        ref(
            database,
            DB_PATHS.notifications
        ),
        (snapshot) => {

            const data =
                snapshot.val();

            loadNotifications(
                data
            );

        },
        (error) => {

            console.error(
                "Notification listener error:",
                error
            );

        }
    );


    // ========================================================
    // MAINTENANCE
    // ========================================================

    onValue(
        ref(
            database,
            DB_PATHS.maintenance
        ),
        (snapshot) => {

            const data =
                snapshot.val();

            loadMaintenance(
                data
            );

        },
        (error) => {

            console.error(
                "Maintenance listener error:",
                error
            );

        }
    );


    console.log(
        "📡 All Firebase realtime listeners attached."
    );

}


// ============================================================
// LOAD TOOLS
// ============================================================

function loadTools(
    data
) {

    if (!data) {

        AppState.tools =
            [];

        renderTools();

        return;

    }

    const tools =
        Object.entries(data)
            .map(
                ([id, value]) => ({

                    id,

                    ...(value || {})

                })
            )
            .sort(
                (a, b) => {

                    return (
                        Number(
                            a.order || 999999
                        ) -
                        Number(
                            b.order || 999999
                        )
                    );

                }
            );

    AppState.tools =
        tools;

    console.log(
        `🛠️ ${tools.length} tools loaded from Realtime Database.`
    );

    renderTools();

}


// ============================================================
// RENDER TOOLS
// ============================================================

function renderTools() {

    const grid =
        document.querySelector(
            ".tools-grid"
        );

    if (!grid) {

        console.warn(
            "⚠️ .tools-grid not found."
        );

        return;

    }


    // Remove old generated cards only
    grid.querySelectorAll(
        "[data-firebase-tool]"
    ).forEach(
        (element) => {

            element.remove();

        }
    );


    const tools =
        AppState.tools;

    if (!tools.length) {

        updateNoResults(
            0
        );

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

    card.dataset.firebaseTool =
        "true";

    card.dataset.toolId =
        tool.id || "";

    card.dataset.name =
        tool.name || "";

    card.dataset.description =
        tool.description || "";

    card.dataset.category =
        (
            tool.category ||
            "all"
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
        escapeHTML(
            tool.icon ||
            tool.image ||
            "https://i.ibb.co/ZRY5X0d0/Gemini-Generated-Image-raajdoraajdoraaj.png"
        );

    const link =
        escapeHTML(
            tool.link ||
            tool.url ||
            "#"
        );


    card.innerHTML = `

        <div class="tool-card-image">

            <img
                src="${icon}"
                alt="${name}"
                loading="lazy"
                onerror="
                    this.onerror=null;
                    this.src='https://i.ibb.co/ZRY5X0d0/Gemini-Generated-Image-raajdoraajdoraaj.png';
                "
            >

        </div>

        <div class="tool-card-content">

            <h3>
                ${name}
            </h3>

            <p>
                ${description}
            </p>

            <a
                href="${link}"
                class="btn-premium"
                data-tool-link="${link}"
            >
                Open Tool
                <i data-lucide="arrow-up-right"></i>
            </a>

        </div>

    `;

    return card;

}


// ============================================================
// LOAD MENU
// ============================================================

function loadMenu(
    data
) {

    if (!data) {

        AppState.menu =
            [];

        return;

    }

    AppState.menu =
        Object.entries(data)
            .map(
                ([id, value]) => ({

                    id,

                    ...(value || {})

                })
            )
            .sort(
                (a, b) => {

                    return (
                        Number(
                            a.order || 999999
                        ) -
                        Number(
                            b.order || 999999
                        )
                    );

                }
            );


    console.log(
        `📂 ${AppState.menu.length} menu items loaded.`
    );

    renderMenu();

}


// ============================================================
// RENDER MENU
// ============================================================

function renderMenu() {

    const containers =
        document.querySelectorAll(
            "[data-menu-container]"
        );

    if (!containers.length) {

        return;

    }


    containers.forEach(
        (container) => {

            container.innerHTML =
                "";

        }
    );


    AppState.menu.forEach(
        (item) => {

            containers.forEach(
                (container) => {

                    const element =
                        document.createElement(
                            "a"
                        );

                    element.className =
                        "menu-item";

                    element.href =
                        item.link ||
                        "#";

                    if (
                        item.category
                    ) {

                        element.dataset.category =
                            item.category;

                    }

                    element.innerHTML = `

                        ${
                            item.icon
                                ? `<i class="${escapeAttribute(item.icon)}"></i>`
                                : ""
                        }

                        <span>
                            ${escapeHTML(
                                item.label ||
                                item.name ||
                                ""
                            )}
                        </span>

                    `;

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
// LOAD SETTINGS
// ============================================================

function loadSettings(
    data
) {

    if (!data) {

        return;

    }

    AppState.settings =
        data;

    console.log(
        "⚙️ Site settings loaded."
    );

    applySettings(
        data
    );

}


// ============================================================
// APPLY SETTINGS
// ============================================================

function applySettings(
    settings
) {

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
    // LOGO
    // --------------------------------------------------------

    if (
        settings.logoUrl
    ) {

        document
            .querySelectorAll(
                "[data-site-logo]"
            )
            .forEach(
                (element) => {

                    if (
                        element.tagName ===
                        "IMG"
                    ) {

                        element.src =
                            settings.logoUrl;

                    }
                    else {

                        element.style.backgroundImage =
                            `url("${settings.logoUrl}")`;

                    }

                }
            );

    }


    // --------------------------------------------------------
    // DESCRIPTION
    // --------------------------------------------------------

    document
        .querySelectorAll(
            "[data-site-description]"
        )
        .forEach(
            (element) => {

                element.textContent =
                    settings.siteDescription ||
                    "";

            }
        );


    // --------------------------------------------------------
    // FOOTER
    // --------------------------------------------------------

    document
        .querySelectorAll(
            "[data-footer-text]"
        )
        .forEach(
            (element) => {

                element.textContent =
                    settings.footerText ||
                    "";

            }
        );


    // --------------------------------------------------------
    // WHATSAPP LINKS
    // --------------------------------------------------------

    setLinks(
        "[data-whatsapp-channel]",
        settings.whatsappChannel
    );

    setLinks(
        "[data-whatsapp-group]",
        settings.whatsappGroup
    );

    setLinks(
        "[data-contact-whatsapp]",
        settings.contactWhatsapp
    );


    // --------------------------------------------------------
    // POPUP SETTINGS
    // --------------------------------------------------------

    if (
        settings.popup1Enabled !==
        undefined
    ) {

        AppState.settings.popup1Enabled =
            settings.popup1Enabled;

    }

    if (
        settings.popup2Enabled !==
        undefined
    ) {

        AppState.settings.popup2Enabled =
            settings.popup2Enabled;

    }

    if (
        settings.popup3Enabled !==
        undefined
    ) {

        AppState.settings.popup3Enabled =
            settings.popup3Enabled;

    }

}


// ============================================================
// LOAD STATS
// ============================================================

function loadStats(
    data
) {

    if (!data) {

        return;

    }

    const globalStats =
        data.global ||
        data;

    AppState.stats = {

        ...AppState.stats,

        ...globalStats

    };


    updateStatsUI();

    console.log(
        "📊 Stats loaded:",
        AppState.stats
    );

}


// ============================================================
// UPDATE STATS UI
// ============================================================

function updateStatsUI() {

    document
        .querySelectorAll(
            "[data-stat='views'], .views-count, #viewsCount"
        )
        .forEach(
            (element) => {

                element.textContent =
                    formatNumber(
                        AppState.stats.views ||
                        0
                    );

            }
        );


    document
        .querySelectorAll(
            "[data-stat='likes'], .likes-count, #likesCount"
        )
        .forEach(
            (element) => {

                element.textContent =
                    formatNumber(
                        AppState.stats.likes ||
                        0
                    );

            }
        );

}


// ============================================================
// INCREMENT GLOBAL VIEW
// ============================================================

async function incrementView() {

    if (!database) {

        return;

    }


    try {

        const viewsRef =
            ref(
                database,
                "stats/global/views"
            );

        await transaction(
            viewsRef,
            (currentValue) => {

                return (
                    Number(
                        currentValue || 0
                    ) + 1
                );

            }
        );

        console.log(
            "👁️ View counted."
        );

    } catch (error) {

        console.warn(
            "View counter failed:",
            error
        );

    }

}


// ============================================================
// INCREMENT LIKE
// ============================================================

window.ZXHLike =
async function () {

    if (!database) {

        showToast(
            "Database unavailable.",
            "error"
        );

        return;

    }


    try {

        const likeRef =
            ref(
                database,
                "stats/global/likes"
            );

        await transaction(
            likeRef,
            (currentValue) => {

                return (
                    Number(
                        currentValue || 0
                    ) + 1
                );

            }
        );


        localStorage.setItem(
            "zxh_liked",
            "true"
        );


        showToast(
            "Thanks for the like ❤️",
            "success"
        );


    } catch (error) {

        console.error(
            "Like error:",
            error
        );

        showToast(
            "Unable to like right now.",
            "error"
        );

    }

};


// ============================================================
// LOAD POPUPS
// ============================================================

function loadPopups(
    data
) {

    if (!data) {

        AppState.popups =
            {};

        return;

    }

    AppState.popups =
        data;

    console.log(
        "🪟 Popups loaded."
    );


    setTimeout(
        () => {

            showDatabasePopups(
                data
            );

        },
        1200
    );

}


// ============================================================
// SHOW DATABASE POPUPS
// ============================================================

function showDatabasePopups(
    data
) {

    if (
        typeof data !==
        "object"
    ) {

        return;

    }


    const popupItems =
        Object.entries(
            data
        );


    for (
        const [id, popup]
        of popupItems
    ) {

        if (
            !popup ||
            typeof popup !==
            "object"
        ) {

            continue;

        }


        if (
            popup.enabled !==
            true
        ) {

            continue;

        }


        const enabledBySettings =
            checkPopupSetting(
                id
            );


        if (
            enabledBySettings ===
            false
        ) {

            continue;

        }


        const popupId =
            popup.id ||
            id ||
            "default";


        const storageKey =
            `zxh_popup_${popupId}`;


        if (
            localStorage.getItem(
                storageKey
            ) ===
            "true"
        ) {

            continue;

        }


        showPopup(
            popup
        );


        localStorage.setItem(
            storageKey,
            "true"
        );


        break;

    }

}


// ============================================================
// CHECK POPUP SETTING
// ============================================================

function checkPopupSetting(
    id
) {

    const normalized =
        String(
            id
        ).toLowerCase();


    if (
        normalized.includes(
            "popup1"
        ) &&
        AppState.settings
            .popup1Enabled === false
    ) {

        return false;

    }


    if (
        normalized.includes(
            "popup2"
        ) &&
        AppState.settings
            .popup2Enabled === false
    ) {

        return false;

    }


    if (
        normalized.includes(
            "popup3"
        ) &&
        AppState.settings
            .popup3Enabled === false
    ) {

        return false;

    }


    return true;

}


// ============================================================
// POPUP UI
// ============================================================

function showPopup(
    popup
) {

    const title =
        popup.title ||
        "ZXH OFFICIAL TOOLS";

    const message =
        popup.message ||
        popup.description ||
        "";

    const image =
        popup.image ||
        popup.imageUrl ||
        "";

    const buttonText =
        popup.buttonText ||
        "Got It";

    const buttonLink =
        popup.buttonLink ||
        popup.link ||
        "";


    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "popup-overlay";

    overlay.style.zIndex =
        "300";


    overlay.innerHTML = `

        <div
            class="popup-content"
            onclick="event.stopPropagation()"
        >

            <button
                class="popup-close-btn"
                aria-label="Close"
                type="button"
            >
                ✕
            </button>

            ${
                image
                    ? `
                        <img
                            src="${escapeAttribute(image)}"
                            alt=""
                            style="
                                width:100%;
                                max-height:220px;
                                object-fit:cover;
                                border-radius:18px;
                                margin-bottom:18px;
                            "
                        >
                    `
                    : `
                        <div style="
                            width:65px;
                            height:65px;
                            margin:0 auto 18px;
                            border-radius:20px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            background:rgba(124,58,237,.15);
                            border:1px solid rgba(124,58,237,.25);
                            font-size:28px;
                        ">
                            🚀
                        </div>
                    `
            }

            <div class="popup-title">
                ${escapeHTML(title)}
            </div>

            <div class="popup-description">
                ${escapeHTML(message)}
            </div>

            <div style="
                display:flex;
                gap:10px;
                margin-top:20px;
            ">

                ${
                    buttonLink
                        ? `
                            <a
                                href="${escapeAttribute(buttonLink)}"
                                class="btn-premium"
                                style="flex:1;text-align:center;"
                            >
                                ${escapeHTML(buttonText)}
                            </a>
                        `
                        : `
                            <button
                                type="button"
                                class="btn-premium popup-ok"
                                style="width:100%;"
                            >
                                ${escapeHTML(buttonText)}
                            </button>
                        `
                }

            </div>

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
            ".popup-ok"
        )
        ?.addEventListener(
            "click",
            close
        );


    document.body.style.overflow =
        "hidden";

}


// ============================================================
// LOAD NOTIFICATIONS
// ============================================================

function loadNotifications(
    data
) {

    if (!data) {

        AppState.notifications =
            {};

        return;

    }

    AppState.notifications =
        data;

    console.log(
        "🔔 Notifications loaded."
    );


    const active =
        data.active;


    if (
        !active ||
        active.enabled !== true
    ) {

        return;

    }


    const notificationId =
        active.id ||
        active.timestamp ||
        "default";


    const storageKey =
        `zxh_notification_${notificationId}`;


    if (
        localStorage.getItem(
            storageKey
        ) ===
        "true"
    ) {

        return;

    }


    setTimeout(
        () => {

            showNotification(
                active
            );

            localStorage.setItem(
                storageKey,
                "true"
            );

        },
        1600
    );

}


// ============================================================
// NOTIFICATION UI
// ============================================================

function showNotification(
    notification
) {

    const title =
        notification.title ||
        "ZXH OFFICIAL TOOLS";

    const message =
        notification.message ||
        notification.description ||
        "New notification available.";

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


    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "popup-overlay";

    overlay.style.zIndex =
        "340";


    overlay.innerHTML = `

        <div
            class="popup-content"
            onclick="event.stopPropagation()"
        >

            <button
                class="popup-close-btn"
                type="button"
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
                ${icon}
            </div>

            <div class="popup-title">
                ${escapeHTML(title)}
            </div>

            <div class="popup-description">
                ${escapeHTML(message)}
            </div>

            <button
                class="btn-premium notification-ok"
                type="button"
                style="width:100%;margin-top:20px;"
            >
                Got It
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
            ".notification-ok"
        )
        ?.addEventListener(
            "click",
            close
        );


    document.body.style.overflow =
        "hidden";

}


// ============================================================
// LOAD MAINTENANCE
// ============================================================

function loadMaintenance(
    data
) {

    AppState.maintenance =
        data || {};


    console.log(
        "🛠️ Maintenance state loaded:",
        data
    );


    if (
        !data ||
        data.enabled !== true
    ) {

        return;

    }


    showMaintenance(
        data
    );

}


// ============================================================
// MAINTENANCE SCREEN
// ============================================================

function showMaintenance(
    data
) {

    if (
        document.getElementById(
            "zxhMaintenanceOverlay"
        )
    ) {

        return;

    }


    const title =
        data.title ||
        "Under Maintenance";

    const message =
        data.message ||
        data.description ||
        "ZXH OFFICIAL TOOLS is temporarily unavailable.";

    const icon =
        data.icon ||
        "🛠️";


    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "zxhMaintenanceOverlay";


    overlay.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            z-index:999999;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:25px;
            background:
                radial-gradient(
                    circle at top,
                    rgba(124,58,237,.18),
                    transparent 40%
                ),
                #05070d;
            color:#fff;
            text-align:center;
        ">

            <div style="
                width:100%;
                max-width:520px;
                padding:35px 25px;
                border-radius:28px;
                background:rgba(255,255,255,.06);
                border:1px solid rgba(255,255,255,.12);
                backdrop-filter:blur(25px);
            ">

                <div style="
                    font-size:55px;
                    margin-bottom:20px;
                ">
                    ${escapeHTML(icon)}
                </div>

                <h1 style="
                    margin:0 0 12px;
                    font-size:28px;
                ">
                    ${escapeHTML(title)}
                </h1>

                <p style="
                    margin:0;
                    color:#9ca3af;
                    line-height:1.7;
                    font-size:15px;
                ">
                    ${escapeHTML(message)}
                </p>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
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
// CATEGORY SYSTEM
// ============================================================

function setupCategories() {

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-category]"
                );

            if (!button) {

                return;

            }


            const category =
                button.dataset.category;


            if (
                !category
            ) {

                return;

            }


            // Ignore tool cards
            if (
                button.closest(
                    ".tool-card"
                )
            ) {

                return;

            }


            AppState.currentCategory =
                category;


            document
                .querySelectorAll(
                    "[data-category]"
                )
                .forEach(
                    (item) => {

                        if (
                            item.closest(
                                ".tool-card"
                            )
                        ) {

                            return;

                        }

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


    let visibleCount =
        0;


    cards.forEach(
        (card) => {

            const name =
                (
                    card.dataset.name ||
                    card.querySelector("h3")
                        ?.textContent ||
                    ""
                ).toLowerCase();


            const description =
                (
                    card.dataset.description ||
                    card.querySelector("p")
                        ?.textContent ||
                    ""
                ).toLowerCase();


            const cardCategory =
                (
                    card.dataset.category ||
                    "all"
                ).toLowerCase();


            const matchesSearch =
                !query ||
                name.includes(
                    query
                ) ||
                description.includes(
                    query
                );


            const matchesCategory =
                category === "all" ||
                cardCategory ===
                    category;


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

        noResults.style.cssText = `
            padding:50px 20px;
            text-align:center;
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

            <p style="
                font-size:13px;
            ">
                Try another search or category.
            </p>

        `;


        document
            .querySelector(
                ".tools-grid"
            )
            ?.appendChild(
                noResults
            );

    }


    noResults.style.display =
        "block";

}


// ============================================================
// INSTALL PROMPT
// ============================================================

function setupInstallPrompt() {

    window.addEventListener(
        "beforeinstallprompt",
        (event) => {

            event.preventDefault();

            AppState.deferredInstallPrompt =
                event;


            if (
                !AppState.installPromptDismissed
            ) {

                setTimeout(
                    () => {

                        showInstallPrompt();

                    },
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
// SHOW INSTALL PROMPT
// ============================================================

function showInstallPrompt() {

    const overlay =
        document.getElementById(
            "installPromptOverlay"
        );


    if (!overlay) {

        return;

    }


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
// HIDE INSTALL PROMPT
// ============================================================

function hideInstallPrompt() {

    const overlay =
        document.getElementById(
            "installPromptOverlay"
        );


    if (!overlay) {

        return;

    }


    overlay.style.display =
        "none";


    document.body.style.overflow =
        "";

}


// ============================================================
// DISMISS INSTALL PROMPT
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
            "PWA install:",
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

    } catch (error) {

        console.error(
            "Install error:",
            error
        );

    }

};


// ============================================================
// INSTALLED MODE
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
        !("serviceWorker" in navigator)
    ) {

        return;

    }


    window.addEventListener(
        "load",
        async () => {

            try {

                const registration =
                    await navigator.serviceWorker
                        .register(
                            "./service-worker.js"
                        );


                console.log(
                    "✅ Service Worker:",
                    registration.scope
                );

            } catch (error) {

                console.warn(
                    "Service Worker failed:",
                    error
                );

            }

        }
    );

}


// ============================================================
// GLOBAL EVENTS
// ============================================================

function setupGlobalEvents() {

    // --------------------------------------------------------
    // TOOL LINKS
    // --------------------------------------------------------

    document.addEventListener(
        "click",
        (event) => {

            const link =
                event.target.closest(
                    "[data-tool-link]"
                );


            if (!link) {

                return;

            }


            const url =
                link.dataset.toolLink;


            if (
                !url ||
                url === "#"
            ) {

                return;

            }


            // Let normal anchor navigation happen.
            if (
                link.tagName ===
                "A"
            ) {

                return;

            }


            window.location.href =
                url;

        }
    );


    // --------------------------------------------------------
    // LIKE BUTTONS
    // --------------------------------------------------------

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-like]"
                );


            if (!button) {

                return;

            }


            event.preventDefault();

            ZXHLike();

        }
    );


    // --------------------------------------------------------
    // CTRL + K
    // --------------------------------------------------------

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


                if (search) {

                    search.focus();

                }

            }

        }
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

        } catch (error) {

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
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:9px;
            background:rgba(255,255,255,.08);
            font-weight:900;
        ">
            ${icon}
        </div>

        <div class="toast-text">
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
// HELPERS
// ============================================================

function setLinks(
    selector,
    url
) {

    if (!url) {

        return;

    }


    document
        .querySelectorAll(
            selector
        )
        .forEach(
            (element) => {

                element.href =
                    url;

            }
        );

}


// ============================================================
// NUMBER FORMAT
// ============================================================

function formatNumber(
    value
) {

    const number =
        Number(
            value || 0
        );


    return number.toLocaleString(
        "en-US"
    );

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
// COUNT PAGE VIEW
// ============================================================

// Wait until DOM is ready so the first page load
// is counted after Firebase has initialized.

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                incrementView();

            },
            800
        );

    }
);


// ============================================================
// GLOBAL ZXH OBJECT
// ============================================================

window.ZXH = {

    firebaseApp,

    database,

    state:
        AppState,

    paths:
        DB_PATHS,

    showInstallPrompt,

    hideInstallPrompt,

    showToast,

    filterTools,

    incrementView,

    like:
        window.ZXHLike

};


// ============================================================
// STARTUP LOG
// ============================================================

console.log(
    "%c☠️ ZXH OFFICIAL TOOLS 🚀",
    "font-size:18px;font-weight:900;color:#8b5cf6"
);

console.log(
    "📡 Database root: /"
);

console.log(
    "🛠️ Tools path: /tools"
);

console.log(
    "📂 Menu path: /menu"
);

console.log(
    "⚙️ Settings path: /settings"
);

console.log(
    "📊 Stats path: /stats"
);

console.log(
    "🪟 Popups path: /popups"
);

console.log(
    "🔔 Notifications path: /notifications"
);

console.log(
    "🛠️ Maintenance path: /maintenance"
);