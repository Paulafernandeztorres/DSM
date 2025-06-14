import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config"; // ajusta según ruta
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import Toast from "react-native-toast-message";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error de inicio de sesión",
        text2: "Por favor, completa todos los campos.",
      });
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Obtener datos del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        dispatch(
          setUser({
            user: userCredential.user.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          })
        );
      } else {
        dispatch(
          setUser({
            user: userCredential.user.uid,
            name: null,
            email: userCredential.user.email,
            role: null,
          })
        );
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        Toast.show({
          type: "error",
          text1: "Error de inicio de sesión",
          text2: "Credenciales inválidas. Verifica tu correo y contraseña.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error de inicio de sesión",
          text2: error.message,
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
            <Ionicons
              name={secureEntry ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.forgotText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  forgotText: {
    color: "#4f46e5",
    textAlign: "center",
    marginTop: 16,
  },
});
