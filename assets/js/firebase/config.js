/**
 * ==========================================================================
 * CONFIGURAÇÃO DO FIREBASE (assets/js/firebase/config.js)
 * Conecta o portal Lumora de forma segura no Firebase Firestore.
 * ==========================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKR-i0mngk6DImCTzv7YCE-ubgK7gMj4Y",
  authDomain: "lumoramoments1.firebaseapp.com",
  projectId: "lumoramoments1",
  storageBucket: "lumoramoments1.firebasestorage.app",
  messagingSenderId: "444655488382",
  appId: "1:444655488382:web:991fbad19330cde358b72f",
  measurementId: "G-EGRC5WNG4W"
};

const app = initializeApp(firebaseConfig);

// Exporta o banco Firestore para o mural.js
export const db = getFirestore(app);