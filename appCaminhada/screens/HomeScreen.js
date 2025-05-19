import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config"; // ajusta según ruta
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/authSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Bienvenido a Home!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeText: { fontSize: 24, marginBottom: 20 },
  logoutButton: { backgroundColor: "#4f46e5", padding: 14, borderRadius: 14 },
  logoutText: { color: "#fff", fontWeight: "600" },
});
