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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);

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
              // Cambiar el estado del producto a "No disponible"
              await updateDoc(prodRef, { status: "No disponible" });
              return { id: productId, ...prodSnap.data(), status: "No disponible" };
            }
            return null;
          })
        );
        setProductsData(products.filter(Boolean));
      }

      // Cambiar el estado de la reserva a "completed"
      await updateDoc(resRef, { status: "completed" });
      setReservation({ ...resData, status: "completed" });
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

  const statusOptions = ["confirmed", "cancelled", "completed"];

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
                    <View style={styles.dataRow}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color="#007BFF"
                        style={styles.dataIcon}
                      />
                      <Text style={styles.dataText}>{userData.name}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color="#007BFF"
                        style={styles.dataIcon}
                      />
                      <Text style={styles.dataText}>{userData.email}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Productos</Text>
                  {productsData.map((product) => (
                    <View key={product.id} style={styles.productContainer}>
                      <View style={styles.productInfo}>
                        <Text style={styles.productTitle}>{product.name}</Text>
                        {/* Galería de imágenes aquí */}
                        {product.images && product.images.length > 0 && (
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 8, marginBottom: 8 }}
                          >
                            {product.images.map((img, idx) => (
                              <TouchableOpacity
                                key={idx}
                                onPress={() => {
                                  setModalImage(img);
                                  setModalVisible(true);
                                }}
                              >
                                <Image
                                  source={{ uri: img }}
                                  style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 8,
                                    marginRight: 8,
                                    borderWidth: 2,
                                    borderColor: "#eee",
                                  }}
                                />
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        )}
                        <View style={styles.dataRow}>
                          <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={20}
                            color="#007BFF"
                            style={styles.dataIcon}
                          />
                          <Text style={styles.dataText}>
                            {product.description}
                          </Text>
                        </View>
                        <View style={styles.dataRow}>
                          <Ionicons
                            name="pricetag-outline"
                            size={20}
                            color="#007BFF"
                            style={styles.dataIcon}
                          />
                          <Text style={styles.dataText}>{product.price} €</Text>
                        </View>
                        <View style={styles.dataRow}>
                          <Ionicons
                            name="cube-outline"
                            size={20}
                            color="#007BFF"
                            style={styles.dataIcon}
                          />
                          <Text style={styles.dataText}>{product.status}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  {/* Total a pagar */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      marginTop: 12,
                      paddingTop: 8,
                    }}
                  >
                    <Ionicons
                      name="calculator-outline"
                      size={22}
                      color="#007BFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                        color: "#222",
                      }}
                    >
                      Total:{" "}
                      {productsData
                        .reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
                        .toFixed(2)}{" "}
                      €
                    </Text>
                  </View>
                </View>

                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Reserva</Text>
                  <View style={styles.dataRow}>
                    <Ionicons
                      name="finger-print-outline"
                      size={20}
                      color="#007BFF"
                      style={styles.dataIcon}
                    />
                    <Text style={styles.dataText}>{reservation.id}</Text>
                  </View>
                  <View style={styles.dataRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#007BFF"
                      style={styles.dataIcon}
                    />
                    <Text style={styles.dataText}>
                      {reservation.timestamp?.toDate?.().toLocaleString?.() ||
                        reservation.timestamp}
                    </Text>
                  </View>

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

      {/* Modal para imagen ampliada */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: modalImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
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
    status: "Disponible", // Default value set to "Disponible"
    category: "Otro",
  });
  const [modalImage, setModalImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const categories = [
    "Ropa",
    "Juguetes",
    "Electrónica",
    "Material escolar",
    "Calzado",
    "Adornos",
    "Artesanía",
    "Otro",
  ];

  const statuses = ["Disponible", "Reservado", "No disponible"];

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
        status: "Disponible",
        category: "Otro",
      });
      setImages([]);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
    setUploading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity style={styles.scanButton} onPress={pickImage}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
          <Text style={styles.scanButtonText}>Sacar foto</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginVertical: 8 }}>
          {images.map((img, idx) => (
            <View key={idx} style={{ position: "relative", marginRight: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalImage(img);
                  setModalVisible(true);
                }}
              >
                <Image
                  source={{ uri: img }}
                  style={{ width: 90, height: 90, borderRadius: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 2,
                  elevation: 2,
                }}
                onPress={() => {
                  setImages(images.filter((_, i) => i !== idx));
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#e11d48" />
              </TouchableOpacity>
            </View>
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
        <TouchableOpacity
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
          onPress={() => setShowStatusDropdown(!showStatusDropdown)}
        >
          <Text style={{ flex: 1, color: "#000" }}>
            {form.status || "Estado"}
          </Text>
          <Ionicons
            name={showStatusDropdown ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
        {showStatusDropdown && (
          <View style={[styles.dropdown, { marginBottom: 20 }]}>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.dropdownItem}
                onPress={() => {
                  handleChange("status", status);
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <Text style={{ flex: 1, color: "#000" }}>
            {form.category || "Categoría"}
          </Text>
          <Ionicons
            name={showCategoryDropdown ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
        {showCategoryDropdown && (
          <View style={[styles.dropdown, { marginBottom: 20 }]}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.dropdownItem}
                onPress={() => {
                  handleChange("category", category);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ marginTop: showCategoryDropdown || showStatusDropdown ? 20 : 0 }}>
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
        </View>
        {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </ScrollView>
      {/* Modal para ver imagen en grande */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: modalImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
}

// --- Tab Navigator principal ---
const Tab = createMaterialTopTabNavigator();

export default function ScannerScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 40 }}>
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
    backgroundColor: "#f0f2f5",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
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
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  fullImage: {
    width: "90%",
    height: "70%",
    borderRadius: 16,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 30,
    zIndex: 101,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dataIcon: {
    marginRight: 8,
  },
  dataText: {
    fontSize: 15,
    color: "#444",
  },
  dropdown: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
});
