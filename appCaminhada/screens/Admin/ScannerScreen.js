import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import QRComponent from "../../componentes/QRComponent";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function ScannerScreen() {
  const [scanning, setScanning] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  const handleQRCode = async (reservationId) => {
    setLoading(true);
    setError("");
    setReservation(null);
    setUserData(null);
    setProductsData([]);
    try {
      // 1. Obtener reserva
      const resRef = doc(db, "reservations", reservationId);
      const resSnap = await getDoc(resRef);

      if (!resSnap.exists()) {
        setError("Reserva no encontrada.");
        setLoading(false);
        return;
      }

      const resData = { id: resSnap.id, ...resSnap.data() };
      setReservation(resData);

      // 2. Obtener usuario
      const userRef = doc(db, "users", resData.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      // 3. Obtener productos
      if (Array.isArray(resData.items)) {
        const products = await Promise.all(
          resData.items.map(async (productId) => {
            const prodRef = doc(db, "products", productId);
            const prodSnap = await getDoc(prodRef);
            if (prodSnap.exists()) {
              return { id: productId, ...prodSnap.data() };
            }
            return null;
          })
        );
        setProductsData(products.filter(Boolean));
      }
    } catch (e) {
      setError("Error al cargar datos: " + e.message);
    }
    setLoading(false);
    setScanning(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (!reservation) return;
    setUpdatingStatus(true);
    try {
      const resRef = doc(db, "reservations", reservation.id);
      await updateDoc(resRef, { status: newStatus });
      setReservation({ ...reservation, status: newStatus });
      Alert.alert("Estado actualizado", `Nuevo estado: ${newStatus}`);
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
    setUpdatingStatus(false);
  };

  const statusOptions = ["pending", "confirmed", "cancelled", "completed"];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {scanning && (
          <QRComponent
            onCodeScanned={(id) => handleQRCode(id)}
            onCancel={() => setScanning(false)}
          />
        )}

        {loading && <ActivityIndicator size="large" color="#333" />}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {reservation && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut}>
            {/* Usuario */}
            {userData && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Usuario</Text>
                <Text style={styles.info}>👤 Nombre: {userData.name}</Text>
                <Text style={styles.info}>📧 Email: {userData.email}</Text>
              </View>
            )}

            {/* Productos */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Productos</Text>
              {productsData.map((product) => (
                <View key={product.id} style={styles.productContainer}>
                  {product.images?.[0] && (
                    <Image
                      source={{ uri: product.images[0] }}
                      style={styles.productImage}
                    />
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{product.name}</Text>
                    <Text style={styles.info}>💬 {product.description}</Text>
                    <Text style={styles.info}>
                      💲 Precio: {product.price} €
                    </Text>
                    <Text style={styles.info}>📦 Estado: {product.status}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Reserva */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Reserva</Text>
              <Text style={styles.info}>🆔 ID: {reservation.id}</Text>
              <Text style={styles.info}>
                📅 Fecha:{" "}
                {reservation.timestamp?.toDate?.().toLocaleString?.() ||
                  reservation.timestamp}
              </Text>

              <Text style={{ marginTop: 10, marginBottom: 4 }}>
                Cambiar estado:
              </Text>
              <Picker
                selectedValue={reservation.status}
                onValueChange={(value) => handleStatusChange(value)}
                enabled={!updatingStatus}
              >
                {statusOptions.map((status) => (
                  <Picker.Item label={status} value={status} key={status} />
                ))}
              </Picker>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {!scanning && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScanning(true)}
        >
          <Ionicons name="camera-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 24 : 24,
    backgroundColor: "#f0f2f5",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  info: {
    fontSize: 15,
    color: "#444",
    marginBottom: 6,
  },
  error: {
    color: "red",
    padding: 16,
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 4,
  },
});
