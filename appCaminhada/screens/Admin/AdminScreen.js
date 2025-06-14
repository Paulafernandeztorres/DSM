import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/authSlice";
import { collection, getDocs } from "firebase/firestore";

export default function AdminScreen({ navigation }) {
  const dispatch = useDispatch();
  const { name, email, role } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    clientes: 0,
    productos: 0,
    reservas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const productsSnapshot = await getDocs(collection(db, "products"));
        const reservationsSnapshot = await getDocs(collection(db, "reservations"));

        setStats({
          clientes: usersSnapshot.size,
          productos: productsSnapshot.size,
          reservas: reservationsSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
      }}
    >
      <Text style={styles.welcomeText}>¡Bienvenido, administrador!</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Información personal</Text>
        <Text style={styles.infoText}>Nombre: {name}</Text>
        <Text style={styles.infoText}>Correo: {email}</Text>
        <Text style={styles.infoText}>Rol: {role}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Estadísticas globales</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4f46e5"
            style={{ marginTop: 20 }}
          />
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.clientes}</Text>
              <Text style={styles.statLabel}>Clientes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.productos}</Text>
              <Text style={styles.statLabel}>Productos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.reservas}</Text>
              <Text style={styles.statLabel}>Reservas</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 20 },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#222",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4f46e5",
  },
  infoText: { fontSize: 16, marginBottom: 6, color: "#333" },
  logoutButton: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#4f46e5",
  },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#222" },
  statLabel: { fontSize: 14, color: "#666", marginTop: 4 },
});
