// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for heart icon
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

export default function SearchScreen() {
  const { currentUserId, email } = useSelector((state) => state.auth); // Ahora también obtenemos el email
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]); // State to track favorite products
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const favoritesSnapshot = await getDocs(collection(db, "favorites"));
      const favoritesData = favoritesSnapshot.docs
        .filter((doc) => doc.data().userId === currentUserId)
        .map((doc) => doc.data().productId);
      setFavorites(favoritesData);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleReserve = async () => {
    if (!currentUserId) {
      Alert.alert("Error", "No se pudo identificar al usuario.");
      return;
    }
    try {
      const reservationData = {
        items: [selectedProduct.id],
        status: "confirmed",
        timestamp: serverTimestamp(),
        userId: currentUserId, 
      };

      // Crear la reserva y obtener el ID generado
      const reservationRef = await addDoc(
        collection(db, "reservations"),
        reservationData
      );
      const reservationId = reservationRef.id;

      await setDoc(doc(db, "products", selectedProduct.id), {
        ...selectedProduct,
        status: "Reservado",
      });

      // Generar URL de imagen QR usando un servicio externo
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${reservationId}&size=150x150`;

      // Enviar correo de confirmación al usuario
      try {
        const userEmail = email;
        const MAILJET_API_KEY = "79ecbbe1af80050b7fa6cf126d96b206";
        const MAILJET_SECRET_KEY = "ecf5faae03817006e80d80be8ce639ba";

        const fecha = new Date().toLocaleString();
        const producto = selectedProduct;
        const nombreProducto = producto.name;
        const descripcion = producto.description || "Sin descripción";
        const precio = producto.price
          ? `${producto.price} €`
          : "Precio no disponible";
        const categoria = producto.category || "Sin categoría";
        const imagen =
          producto.images && producto.images[0] ? producto.images[0] : null;

        await axios.post(
          "https://api.mailjet.com/v3.1/send",
          {
            Messages: [
              {
                From: {
                  Email: "miguelff222@gmail.com",
                  Name: "App Caminhada",
                },
                To: [
                  {
                    Email: userEmail,
                    Name: "Usuario",
                  },
                ],
                Subject: `¡Reserva confirmada! ${nombreProducto} - App Caminhada`,
                TextPart: `¡Hola!\n\nTu reserva del producto ${nombreProducto} ha sido confirmada el ${fecha}.\n\nDetalles del producto:\n- Nombre: ${nombreProducto}\n- Descripción: ${descripcion}\n- Precio: ${precio}\n- Categoría: ${categoria}\n\nAdjuntamos tu código QR para recoger el producto.\n\n¡Gracias por confiar en App Caminhada!`,
                HTMLPart: `
                  <div style='font-family: Arial, sans-serif; color: #222;'>
                    <h1 style='color: #4f46e5;'>¡Reserva confirmada!</h1>
                    <p>Hola,</p>
                    <p>Te confirmamos que tu reserva del producto <b>${nombreProducto}</b> ha sido realizada con éxito el <b>${fecha}</b>.</p>
                    <h2 style='color: #4f46e5;'>Detalles del producto</h2>
                    <ul style='font-size: 16px;'>
                      <li><b>Nombre:</b> ${nombreProducto}</li>
                      <li><b>Descripción:</b> ${descripcion}</li>
                      <li><b>Precio:</b> ${precio}</li>
                      <li><b>Categoría:</b> ${categoria}</li>
                    </ul>
                    ${
                      imagen
                        ? `<img src='${imagen}' alt='Imagen del producto' style='width:180px;height:auto;border-radius:10px;margin:16px 0;' />`
                        : ""
                    }
                    <h2 style='color: #4f46e5;'>Tu código QR</h2>
                    <p>Presenta este código QR al recoger tu producto:</p>
                    <img src='${qrUrl}' alt='QR' style='width:150px;height:150px;margin:12px 0;' />
                    <p style='margin-top:24px;'>Si tienes alguna duda, responde a este correo o contacta con nuestro equipo de soporte.</p>
                    <p style='color:#888;font-size:13px;margin-top:32px;'>App Caminhada &copy; 2025</p>
                  </div>
                `,
              },
            ],
          },
          {
            auth: {
              username: MAILJET_API_KEY,
              password: MAILJET_SECRET_KEY,
            },
          }
        );
      } catch (mailError) {
        console.error("Error enviando el correo:", mailError);
      }

      Alert.alert(
        "Reserva realizada",
        `Has reservado el producto: ${selectedProduct.name}`
      );
      setModalVisible(false);
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      Alert.alert(
        "Error",
        "No se pudo realizar la reserva. Inténtalo de nuevo."
      );
    }
  };

  const toggleFavorite = async (product) => {
    try {
      const isFavorite = favorites.includes(product.id);
      if (isFavorite) {
        await deleteDoc(doc(db, "favorites", `${currentUserId}_${product.id}`));
        setFavorites(favorites.filter((id) => id !== product.id));
      } else {
        const favoriteData = {
          productId: product.id,
          userId: currentUserId,
          timestamp: serverTimestamp(),
        };
        await setDoc(
          doc(db, "favorites", `${currentUserId}_${product.id}`),
          favoriteData
        );
        setFavorites([...favorites, product.id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert(
        "Error",
        "No se pudo actualizar favoritos. Inténtalo de nuevo."
      );
    }
  };

  const renderProduct = ({ item }) => {
    const isFavorite = favorites.includes(item.id);
    const isAvailable = item.status === "Disponible";
    const statusColor =
      item.status === "Disponible"
        ? "green"
        : item.status === "Reservado"
        ? "orange"
        : "red";
    const cardOpacity = isAvailable ? 1 : 0.5;

    return (
      <View style={[styles.productCard, { opacity: cardOpacity }]}>
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => toggleFavorite(item)}
          disabled={!isAvailable} // Deshabilitar interacción si no está disponible
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "red" : "gray"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isAvailable) {
              setSelectedProduct(item);
              setModalVisible(true);
            }
          }}
          disabled={!isAvailable} // Deshabilitar interacción si no está disponible
        >
          <Image source={{ uri: item.images[0] }} style={styles.productImage} />
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price} €</Text>
          <Text style={[styles.productStatus, { color: statusColor }]}>
            {item.status || "Disponible"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Obtener categorías únicas
  const categories = [
    "Todas",
    ...Array.from(new Set(products.map((p) => p.category || "Otro"))),
  ];

  // Filtrar productos por texto y categoría
  const filteredProducts = products.filter((product) => {
    const matchesText =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchText.toLowerCase()));
    const matchesCategory =
      selectedCategory === "Todas" || product.category === selectedCategory;
    return matchesText && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explora nuestros productos</Text>

        {/* Buscador y filtro */}

        <View style={{ marginTop: 32, marginBottom: 12 }}>
          <TextInput
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: 10,
              padding: 10,
              fontSize: 16,
              marginBottom: 8,
            }}
            placeholder="Buscar producto..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <View
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={{ height: 50, width: "100%" }}
              dropdownIconColor="#4f46e5"
            >
              {categories.map((cat) => (
                <Picker.Item label={cat} value={cat} key={cat} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Lista de productos filtrados */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4f46e5"
            style={styles.loadingSpinner}
          />
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            numColumns={2}
            key={2}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              !loading && (
                <Text
                  style={{ textAlign: "center", marginTop: 40, color: "#888" }}
                >
                  No se encontraron productos.
                </Text>
              )
            }
          />
        )}

        {selectedProduct && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Botón de cerrar (cruz) */}
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                {/* Carrusel de imágenes */}
                <FlatList
                  data={selectedProduct.images}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, idx) => idx.toString()}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                  style={{ marginBottom: 16 }}
                />
                <Text style={styles.modalName}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>{selectedProduct.price} €</Text>
                <Text style={styles.modalDescription}>
                  {selectedProduct.description}
                </Text>
                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={handleReserve}
                >
                  <Text style={styles.reserveButtonText}>Reservar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  titleContainer: { marginBottom: 16, marginTop: 32 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4f46e5",
    textAlign: "center",
  },
  loadingSpinner: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { paddingBottom: 16 },
  productCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 8,
    margin: 8,
    alignItems: "center",
    justifyContent: "center", // Centrar contenido verticalmente
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "45%",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
    alignSelf: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center", // Centrar texto horizontalmente
  },
  productPrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    textAlign: "center", // Centrar texto horizontalmente
  },
  productStatus: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center", // Centrar texto horizontalmente
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    width: "80%",
    alignItems: "center",
  },
  modalImage: { width: 150, height: 150, borderRadius: 10, marginBottom: 16 },
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalPrice: { fontSize: 18, color: "#666", marginBottom: 8 },
  modalDescription: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 16,
  },
  reserveButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 8,
  },
  reserveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  closeButton: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  closeButtonText: { color: "#333", fontWeight: "600", fontSize: 14 },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 2,
  },
});
