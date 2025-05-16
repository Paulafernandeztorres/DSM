// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDnNbJDYLIiwJuXVE5k60FrjPgDbsgi610",
  authDomain: "proyectocaminhada.firebaseapp.com",
  projectId: "proyectocaminhada",
  storageBucket: "proyectocaminhada.firebasestorage.app",
  messagingSenderId: "788888867409",
  appId: "1:788888867409:web:a766b2544232cec8d85e70",
  measurementId: "G-1NEQ011742"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa autenticación
const auth = getAuth(app);

export { auth };
