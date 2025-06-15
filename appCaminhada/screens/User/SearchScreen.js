// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Modal, Alert } from "react-native";
import { collection, getDocs, addDoc, serverTimestamp, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for heart icon

export default function SearchScreen() {
  const { currentUserId } = useSelector((state) => state.auth); // Get currentUserId from Redux state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]); // State to track favorite products

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
    try {
      const reservationData = {
        items: [selectedProduct.id],
        status: "confirmed",
        timestamp: serverTimestamp(),
        userId: currentUserId, // Use the actual currentUserId from Redux state
      };

      await addDoc(collection(db, "reservations"), reservationData);

      Alert.alert("Reserva realizada", `Has reservado el producto: ${selectedProduct.name}`);
      setModalVisible(false);
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      Alert.alert("Error", "No se pudo realizar la reserva. Inténtalo de nuevo.");
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
        await setDoc(doc(db, "favorites", `${currentUserId}_${product.id}`), favoriteData);
        setFavorites([...favorites, product.id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "No se pudo actualizar favoritos. Inténtalo de nuevo.");
    }
  };

  const renderProduct = ({ item }) => {
    const isFavorite = favorites.includes(item.id);
    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => toggleFavorite(item)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "red" : "gray"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedProduct(item);
            setModalVisible(true);
          }}
        >
          <Image source={{ uri: item.images[0] }} style={styles.productImage} />
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price} €</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explora nuestros productos</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={styles.loadingSpinner} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          numColumns={2}
          key={2}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
              <Image
                source={{ uri: selectedProduct.images[0] }}
                style={styles.modalImage}
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
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
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
  productName: { fontSize: 14, fontWeight: "bold", color: "#333", textAlign: "center" },
  productPrice: { fontSize: 12, color: "#666", marginTop: 2 },
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
  modalName: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 8 },
  modalPrice: { fontSize: 18, color: "#666", marginBottom: 8 },
  modalDescription: { fontSize: 16, color: "#444", textAlign: "center", marginBottom: 16 },
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
});
