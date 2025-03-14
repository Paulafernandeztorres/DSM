// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getDatabase,
  ref as databaseRef,
  set,
  get,
  push,
  update,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

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
const storage = getStorage(app);

// Export the initialized services
export { auth, database, storage };

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

// Function to get the image URL from Firebase Storage
const getImageUrl = async (imagePath) => {
  try {
    const imageRef = storageRef(storage, `NFTImages/${imagePath}`);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Error getting image URL:", error);
    return null;
  }
};

// Function to get products from Realtime Database
export const getProductos = async () => {
  const productosRef = databaseRef(database, "Productos");
  const snapshot = await get(productosRef);
  if (snapshot.exists()) {
    const productosData = snapshot.val();
    const productosArray = await Promise.all(
      Object.keys(productosData).map(async (key) => {
        const imageUrl = await getImageUrl(productosData[key].imagen);
        return {
          id: key,
          nombre: productosData[key].nombre,
          precio: productosData[key].precio,
          imagen: imageUrl,
          descripcion: productosData[key].descripcion,
        };
      })
    );
    return productosArray;
  } else {
    console.error("No data available");
    return [];
  }
};

// Function to create a new order in the Realtime Database
export const createPedido = async (pedido) => {
  const db = getDatabase();
  const pedidosRef = databaseRef(db, "Pedidos");
  const newPedidoRef = await push(pedidosRef, pedido);
  return newPedidoRef.key;
};

// Function to update an order with its ID in the Realtime Database
export const updatePedidoWithId = async (pedidoId) => {
  const db = getDatabase();
  const pedidoRef = databaseRef(db, `Pedidos/${pedidoId}`);
  await update(pedidoRef, { id: pedidoId });
};

// Function to save user data in the Realtime Database
export const saveUserData = async (userId, userData) => {
  const userRef = databaseRef(database, `Usuarios/${userId}`);
  await set(userRef, userData);
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return token !== null;
};

export const getUserData = async (userId) => {
  const userRef = databaseRef(database, `Usuarios/${userId}`);
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
  const userCompradosRef = databaseRef(
    database,
    `Usuarios/${userId}/Comprados`
  );
  const newPedido = {
    ...pedido,
    fecha: new Date().toISOString(),
  };
  const newCompradoRef = await push(userCompradosRef, newPedido);
  return newCompradoRef.key;
};

export const contarProductosComprados = (comprados) => {
  const productosContados = {};

  for (const pedidoId in comprados) {
    const pedido = comprados[pedidoId];
    const productos = pedido.Productos;

    productos.forEach((producto) => {
      const productoId = producto.id;
      if (!productosContados[productoId]) {
        productosContados[productoId] = 0;
      }
      productosContados[productoId] += producto.cantidad;
    });
  }

  return productosContados;
};

// Función para subir una imagen a Firebase Storage y guardar los detalles en la Realtime Database
export const uploadNFTImage = async (image, name, description, price) => {
  const imageRef = storageRef(storage, `NFTImages/${image.name}`);
  await uploadBytes(imageRef, image);
  const imageUrl = await getDownloadURL(imageRef);

  const newProductRef = push(databaseRef(database, "Productos"));
  await set(newProductRef, {
    nombre: name,
    descripcion: description,
    precio: parseFloat(price),
    imagen: image.name,
  });

  return imageUrl;
};
