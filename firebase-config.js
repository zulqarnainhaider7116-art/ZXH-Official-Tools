// ============================================================
// ZXH OFFICIAL TOOLS
// FIREBASE CONFIGURATION
// VERSION: 2.0 (UPDATED)
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyD4IsHl-vhp0mBi6vUTfQTKWIL-oZn6LwY",
    authDomain: "zulqar-toolkit-46c6c.firebaseapp.com",
    databaseURL: "https://zulqar-toolkit-46c6c-default-rtdb.firebaseio.com",
    projectId: "zulqar-toolkit-46c6c",
    storageBucket: "zulqar-toolkit-46c6c.firebasestorage.app",
    messagingSenderId: "788764635811",
    appId: "1:788764635811:web:9373f3a36cd1ac45380516"
};

// Initialize Firebase
try {
    if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully");
    } else {
        console.log("✅ Firebase already initialized");
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}

// Database references
const db = firebase.database();
const rootRef = db.ref("zxhofficial");

// Make globally available
window.db = db;
window.rootRef = rootRef;
window.firebaseApp = firebase.app();

console.log("🔥 Firebase Version:", firebase.SDK_VERSION || "10.x");
console.log("📡 Database URL:", firebaseConfig.databaseURL);
console.log("📁 Root Reference:", "zxhofficial");
console.log("✅ Firebase Config loaded successfully");
