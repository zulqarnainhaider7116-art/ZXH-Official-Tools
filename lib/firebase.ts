import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC3IIS6jxnG6h8FcZ0cVsY0Rk2LoYVhu68",
  authDomain: "zxh-official-tools.firebaseapp.com",
  databaseURL: "https://zxh-official-tools-default-rtdb.firebaseio.com",
  projectId: "zxh-official-tools",
  storageBucket: "zxh-official-tools.firebasestorage.app",
  messagingSenderId: "390963219579",
  appId: "1:390963219579:web:682976f10aca6ab7c6a6de",
  measurementId: "G-ZWHSQFXDR7"
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const database = getDatabase(app);
