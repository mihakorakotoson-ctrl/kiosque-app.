// Clés du projet Firebase "marche-voisin" — connecte le site à Firestore.

const firebaseConfig = {
  apiKey: "AIzaSyAEcLQiKP2Oyh1DFRL_U2G_J8W-I2pnHyQ",
  authDomain: "marche-voisin.firebaseapp.com",
  projectId: "marche-voisin",
  storageBucket: "marche-voisin.firebasestorage.app",
  messagingSenderId: "587621341327",
  appId: "1:587621341327:web:938062f8a82df5dc8138fa"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
