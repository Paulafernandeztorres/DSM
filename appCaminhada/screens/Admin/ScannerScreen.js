// ScannerScreen.js
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
  TextInput,
  SafeAreaView,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Picker } from "@react-native-picker/picker";
import QRComponent from "../../componentes/QRComponent";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// --- Pantalla de escaneo QR (igual que antes, puedes extraer tu lógica aquí) ---
function QRScannerTab() {
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
      const resRef = doc(db, "reservations", reservationId);
      const resSnap = await getDoc(resRef);

      if (!resSnap.exists()) {
        setError("Reserva no encontrada.");
        setLoading(false);
        return;
      }

      const resData = { id: resSnap.id, ...resSnap.data() };
      setReservation(resData);

      const userRef = doc(db, "users", resData.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

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
      {scanning ? (
        <>
          <View style={styles.cameraWrapper}>
            <QRComponent
              onCodeScanned={handleQRCode}
              onCancel={() => setScanning(false)}
            />
          </View>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setScanning(false)}
          >
            <Ionicons name="close-outline" size={24} color="#fff" />
            <Text style={styles.scanButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <ScrollView>
            {loading && <ActivityIndicator size="large" color="#333" />}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {reservation && (
              <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut}>
                {userData && (
                  <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Usuario</Text>
                    <Text style={styles.info}>👤 Nombre: {userData.name}</Text>
                    <Text style={styles.info}>📧 Email: {userData.email}</Text>
                  </View>
                )}

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
                        <Text style={styles.info}>
                          💬 {product.description}
                        </Text>
                        <Text style={styles.info}>
                          💲 Precio: {product.price} €
                        </Text>
                        <Text style={styles.info}>
                          📦 Estado: {product.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

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

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setScanning(true)}
          >
            <Ionicons name="camera-outline" size={24} color="#fff" />
            <Text style={styles.scanButtonText}>Leer QR</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// --- Pantalla de carga de productos ---
function UploadProductTab() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    status: "Disponible",
    category: "",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      allowsMultipleSelection: false,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleUpload = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !form.status ||
      !form.category ||
      images.length === 0
    ) {
      Alert.alert(
        "Error",
        "Completa todos los campos y añade al menos una imagen."
      );
      return;
    }
    setUploading(true);
    try {
      // Subir imágenes al storage
      const urls = [];
      for (const uri of images) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `products/${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      // Guardar producto en Firestore
      await addDoc(collection(db, "products"), {
        ...form,
        price: parseFloat(form.price),
        images: urls,
        createdAt: new Date(),
      });
      Alert.alert("Éxito", "Producto cargado correctamente.");
      setForm({
        name: "",
        description: "",
        price: "",
        status: "",
        category: "",
      });
      setImages([]);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
    setUploading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TouchableOpacity style={styles.scanButton} onPress={pickImage}>
        <Ionicons name="camera-outline" size={24} color="#fff" />
        <Text style={styles.scanButtonText}>Sacar foto</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        {images.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img }}
            style={{ width: 60, height: 60, marginRight: 8, borderRadius: 8 }}
          />
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={form.description}
        onChangeText={(v) => handleChange("description", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={form.price}
        onChangeText={(v) => handleChange("price", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Estado"
        value={form.status}
        onChangeText={(v) => handleChange("status", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={form.category}
        onChangeText={(v) => handleChange("category", v)}
      />
      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
        <Text style={styles.scanButtonText}>
          {uploading ? "Cargando..." : "Subir producto"}
        </Text>
      </TouchableOpacity>
      {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </ScrollView>
  );
}

// --- Tab Navigator principal ---
const Tab = createMaterialTopTabNavigator();

export default function ScannerScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 24 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#4f46e5",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIndicatorStyle: { backgroundColor: "#4f46e5" },
        }}
      >
        <Tab.Screen name="Escanear QR" component={QRScannerTab} />
        <Tab.Screen name="Cargar Producto" component={UploadProductTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 24 : 24,
    backgroundColor: "#f0f2f5",
    padding: 16,
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
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    gap: 8,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cameraWrapper: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
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
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
