// ============================================================
// ZXH OFFICIAL TOOLS
// FIREBASE REALTIME DATABASE CONFIG
// ============================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyD4IsHl-vhp0mBi6vUTfQTKWIL-oZn6LwY",

    authDomain:
        "zulqar-toolkit-46c6c.firebaseapp.com",

    databaseURL:
        "https://zulqar-toolkit-46c6c-default-rtdb.firebaseio.com",

    projectId:
        "zulqar-toolkit-46c6c",

    storageBucket:
        "zulqar-toolkit-46c6c.firebasestorage.app",

    messagingSenderId:
        "788764635811",

    appId:
        "1:788764635811:web:9373f3a36cd1ac45380516"

};


// ============================================================
// EXPORT
// ============================================================

export default firebaseConfig;


// ============================================================
// DEBUG
// ============================================================

console.log(
    "%c🔥 ZXH FIREBASE CONFIG LOADED",
    "background:#111827;color:#22c55e;padding:6px 10px;border-radius:6px;font-weight:900;"
);

console.log(
    "📡 Realtime Database:",
    firebaseConfig.databaseURL
);