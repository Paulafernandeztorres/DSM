import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/authSlice";

export default function UserScreen({ navigation }) {
  const dispatch = useDispatch();
  // Accede a los datos del usuario desde Redux
  const { name, email, role } = useSelector((state) => state.auth);

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
      <Text style={styles.welcomeText}>¡Bienvenido a Home del Admin!</Text>
      <Text style={styles.infoText}>Nombre: {name}</Text>
      <Text style={styles.infoText}>Correo: {email}</Text>
      <Text style={styles.infoText}>Rol: {role}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeText: { fontSize: 24, marginBottom: 20 },
  infoText: { fontSize: 18, marginBottom: 8 },
  logoutButton: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontWeight: "600" },
});
