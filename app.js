// ============================================================
// ZXH OFFICIAL TOOLS
// APP.JS
// ============================================================

import firebaseConfig from "./firebase-config.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ============================================================
// FIREBASE
// ============================================================

let firebaseApp = null;
let database = null;

try {

    firebaseApp = initializeApp(firebaseConfig);

    database = getDatabase(firebaseApp);

    console.log(
        "%c ZXH OFFICIAL TOOLS ",
        "background:#7c3aed;color:#fff;padding:6px 12px;border-radius:6px;font-weight:900"
    );

    console.log("Firebase connected successfully.");

} catch (error) {

    console.error(
        "Firebase initialization failed:",
        error
    );

}


// ============================================================
// GLOBAL STATE
// ============================================================

const AppState = {

    deferredInstallPrompt: null,

    installPromptDismissed:
        localStorage.getItem(
            "zxh_install_prompt_dismissed"
        ) === "true",

    currentCategory: "all",

    searchQuery: "",

    tools: []

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
// INIT APP
// ============================================================

function initApp() {

    setupLucide();

    setupInstallPrompt();

    setupSearch();

    setupCategories();

    setupPWA();

    setupFirebaseListeners();

    setupGlobalEvents();

    console.log(
        "ZXH OFFICIAL TOOLS initialized."
    );

}


// ============================================================
// LUCIDE ICONS
// ============================================================

function setupLucide() {

    if (
        typeof window.lucide !== "undefined"
    ) {

        window.lucide.createIcons();

    }

}


// ============================================================
// PWA INSTALL PROMPT
// ============================================================

function setupInstallPrompt() {

    window.addEventListener(
        "beforeinstallprompt",
        (event) => {

            event.preventDefault();

            AppState.deferredInstallPrompt = event;

            console.log(
                "PWA installation is available."
            );

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

            AppState.deferredInstallPrompt = null;

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
// SHOW INSTALL POPUP
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

    overlay.style.display = "flex";

    document.body.style.overflow = "hidden";

    setupLucide();

}


// ============================================================
// HIDE INSTALL POPUP
// ============================================================

function hideInstallPrompt() {

    const overlay =
        document.getElementById(
            "installPromptOverlay"
        );

    if (!overlay) return;

    overlay.style.display = "none";

    document.body.style.overflow = "";

}


// ============================================================
// DISMISS INSTALL PROMPT
// ============================================================

window.dismissInstallPrompt = function () {

    localStorage.setItem(
        "zxh_install_prompt_dismissed",
        "true"
    );

    AppState.installPromptDismissed = true;

    hideInstallPrompt();

};


// ============================================================
// TRIGGER INSTALL
// ============================================================

window.triggerInstall = async function () {

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

        AppState.deferredInstallPrompt = null;

        if (
            result.outcome === "accepted"
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
// CHECK INSTALLED MODE
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
// PWA SERVICE WORKER
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

                } catch (error) {

                    console.error(
                        "Service Worker registration failed:",
                        error
                    );

                }

            }
        );

    }

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
                button.dataset.category;

            AppState.currentCategory =
                category || "all";

            document
                .querySelectorAll(
                    "[data-category]"
                )
                .forEach(
                    (item) =>
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

    let visibleCount = 0;

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
                name.includes(query) ||
                description.includes(query);

            const matchesCategory =
                category === "all" ||
                cardCategory === category;

            const visible =
                matchesSearch &&
                matchesCategory;

            card.style.display =
                visible ? "" : "none";

            if (visible) {
                visibleCount++;
            }

        }
    );

    updateNoResults(visibleCount);

}


// ============================================================
// NO RESULTS
// ============================================================

function updateNoResults(count) {

    let noResults =
        document.getElementById(
            "noResults"
        );

    if (count > 0) {

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
            ">🔍</div>

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
// FIREBASE LISTENERS
// ============================================================

function setupFirebaseListeners() {

    if (!database) return;


    // -----------------------------------------
    // Maintenance Status
    // -----------------------------------------

    const maintenanceRef =
        ref(
            database,
            "settings/maintenance"
        );

    onValue(
        maintenanceRef,
        (snapshot) => {

            const data =
                snapshot.val();

            if (!data) return;

            handleMaintenanceState(
                data
            );

        },
        (error) => {

            console.warn(
                "Maintenance listener:",
                error.message
            );

        }
    );


    // -----------------------------------------
    // Notifications
    // -----------------------------------------

    const notificationRef =
        ref(
            database,
            "notifications"
        );

    onValue(
        notificationRef,
        (snapshot) => {

            const data =
                snapshot.val();

            if (!data) return;

            handleNotifications(
                data
            );

        },
        (error) => {

            console.warn(
                "Notification listener:",
                error.message
            );

        }
    );

}


// ============================================================
// MAINTENANCE HANDLER
// ============================================================

function handleMaintenanceState(
    data
) {

    if (
        data.enabled !== true
    ) {

        return;

    }

    console.log(
        "Maintenance mode enabled."
    );

    /*
        IMPORTANT:
        Maintenance UI will be controlled
        from maintenance.html.

        Do NOT automatically redirect
        every user here until the
        maintenance system is finalized.
    */

}


// ============================================================
// NOTIFICATION HANDLER
// ============================================================

function handleNotifications(
    data
) {

    if (
        typeof data !== "object"
    ) return;

    const notification =
        data.active;

    if (!notification) return;

    if (
        notification.enabled !== true
    ) return;

    const notificationId =
        notification.id ||
        notification.timestamp ||
        "default";

    const shownKey =
        `zxh_notification_${notificationId}`;

    if (
        localStorage.getItem(
            shownKey
        ) === "true"
    ) {

        return;

    }

    showNotification(
        notification
    );

    localStorage.setItem(
        shownKey,
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
                aria-label="Close"
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
                    : "🔔"
                }
            </div>

            <div class="popup-title">
                ${escapeHTML(title)}
            </div>

            <div class="popup-description">
                ${escapeHTML(message)}
            </div>

            <button
                class="btn-premium"
                style="width:100%;"
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
        .addEventListener(
            "click",
            close
        );

    overlay
        .querySelector(
            ".btn-premium"
        )
        .addEventListener(
            "click",
            close
        );

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

            if (!url) return;

            /*
                Normal navigation.
            */

            window.location.href =
                url;

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            // Ctrl + K / Cmd + K
            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
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
// TOAST SYSTEM
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
                () => toast.remove(),
                300
            );

        },
        3500
    );

};


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(
    value
) {

    return String(value)
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
// EXPOSE FIREBASE
// ============================================================

window.ZXH = {

    firebaseApp,

    database,

    state: AppState,

    showInstallPrompt,

    hideInstallPrompt,

    showToast,

    filterTools

};


// ============================================================
// STARTUP
// ============================================================

console.log(
    "%cZXH OFFICIAL TOOLS 🚀",
    "font-size:18px;font-weight:900;color:#8b5cf6"
);