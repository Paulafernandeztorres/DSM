// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set, get, push, update } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU6h_ZgNgsUHgxp1L6iHt5S7SGYB8yqgk",
  authDomain: "proyecto-webapp-573f0.firebaseapp.com",
  databaseURL:
    "https://proyecto-webapp-573f0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "proyecto-webapp-573f0",
  storageBucket: "proyecto-webapp-573f0.firebasestorage.app",
  messagingSenderId: "153350650728",
  appId: "1:153350650728:web:abef338bfa5f0957dd74dd",
  measurementId: "G-Q29LW76GDF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account ",
});
export const signInWithGooglePopup = () => {
  return signInWithPopup(auth, provider);
};
export const signInWithGoogleRedirect = () => {
  return signInWithRedirect(auth, provider);
};

// New functions for email/password authentication
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

// Function to get products from Realtime Database
export const getProductos = async () => {
  const db = getDatabase();
  const productosRef = ref(db, "Productos");
  const snapshot = await get(productosRef);
  if (snapshot.exists()) {
    const productosData = snapshot.val();
    let productosArray = [];
    for (let key in productosData) {
      productosArray.push({
        id: key,
        nombre: productosData[key].nombre,
        precio: productosData[key].precio,
        imagen: productosData[key].imagen,
        descripcion: productosData[key].descripcion,
      });
    }
    return productosArray;
  } else {
    console.error("No data available");
    return [];
  }
};

// Function to create a new order in the Realtime Database
export const createPedido = async (pedido) => {
  const db = getDatabase();
  const pedidosRef = ref(db, "Pedidos");
  const newPedidoRef = await push(pedidosRef, pedido);
  return newPedidoRef.key;
};

// Function to update an order with its ID in the Realtime Database
export const updatePedidoWithId = async (pedidoId) => {
  const db = getDatabase();
  const pedidoRef = ref(db, `Pedidos/${pedidoId}`);
  await update(pedidoRef, { id: pedidoId });
};

// Function to save user data in the Realtime Database
export const saveUserData = async (userId, userData) => {
  const userRef = ref(database, `Usuarios/${userId}`);
  await set(userRef, userData);
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return token !== null;
};

export const getUserData = async (userId) => {
  const userRef = ref(database, `Usuarios/${userId}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.error("No user data available");
    return null;
  }
};

// Function to add a pedido to the user's "Comprados" section
export const addPedidoToUserComprados = async (userId, pedido) => {
  const userCompradosRef = ref(database, `Usuarios/${userId}/Comprados`);
  const newCompradoRef = await push(userCompradosRef, pedido);
  return newCompradoRef.key;
};
