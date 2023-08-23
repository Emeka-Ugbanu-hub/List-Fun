import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function initializeAppIfNecessary() {
  try {
    return getApp();
  } catch (any) {
    const firebaseConfig = {
      apiKey: "AIzaSyAQm9_DBzPnN2nzG7yDAXnlZSEbUDq9Tco",
      authDomain: "olist-fun.firebaseapp.com",
      projectId: "olist-fun",
      storageBucket: "olist-fun.appspot.com",
      messagingSenderId: "438643237771",
      appId: "1:438643237771:web:d312518c31ac26b1fc458e",
      measurementId: "G-YTV7LKZL2B",
    };
    return initializeApp(firebaseConfig);
  }
}
const app = initializeAppIfNecessary();
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
