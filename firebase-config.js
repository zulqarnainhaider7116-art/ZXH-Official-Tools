// ============================================================
// ZXH OFFICIAL TOOLS
// Firebase Realtime Database Configuration
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

// Firebase App
firebase.initializeApp(firebaseConfig);

// Realtime Database
const db = firebase.database();

// Root reference
const rootRef = db.ref("zxhofficial");

console.log("🔥 Firebase initialized successfully");
console.log("📡 Realtime Database connected");