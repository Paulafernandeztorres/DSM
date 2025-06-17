// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BookingsScreen() {
  const { currentUserId } = useSelector((state) => state.auth); // Get currentUserId from Redux state
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [product, setProduct] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchReservations = async () => {
        if (!currentUserId) {
          console.error("Error: currentUserId is undefined. Redirecting to login.");
          Alert.alert("Error", "No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.");
          navigation.navigate("Login"); 
          return;
        }
        try {
          const reservationsQuery = query(
            collection(db, "reservations"),
            where("userId", "==", currentUserId) 
          );
          const reservationsSnapshot = await getDocs(reservationsQuery);
          const reservationsData = reservationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReservations(reservationsData);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchReservations();
    }, [currentUserId])
  );

  const fetchProductDetails = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setProduct(productSnap.data());
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleReservationClick = async (reservation) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
    await fetchProductDetails(reservation.items[0]);
  };

  const cancelReservation = async () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que quieres cancelar esta reserva?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: async () => {
            try {
              const reservationRef = doc(
                db,
                "reservations",
                selectedReservation.id
              );
              await updateDoc(reservationRef, { status: "cancelled" }); // Actualiza el estado de la reserva

              // Actualiza el estado del producto reservado a 'Disponible'
              if (selectedReservation.items && selectedReservation.items[0]) {
                const productRef = doc(
                  db,
                  "products",
                  selectedReservation.items[0]
                );
                await updateDoc(productRef, { status: "Disponible" });
              }

              setReservations((prevReservations) =>
                prevReservations.map((reservation) =>
                  reservation.id === selectedReservation.id
                    ? { ...reservation, status: "cancelled" }
                    : reservation
                )
              );
              setModalVisible(false);
            } catch (error) {
              console.error("Error cancelling reservation:", error);
            }
          },
        },
      ]
    );
  };

  const renderReservation = ({ item }) => {
    const isCancelled = item.status === "cancelled";
    const statusStyle =
      item.status === "confirmed"
        ? styles.confirmedStatus
        : item.status === "completed"
        ? styles.completedStatus
        : item.status === "cancelled"
        ? styles.cancelledStatus
        : null;

    return (
      <TouchableOpacity
        style={[
          styles.reservationCard,
          isCancelled && styles.cancelledReservationCard, // Apply transparency for canceled reservations
        ]}
        onPress={() => !isCancelled && handleReservationClick(item)} // Disable interaction for canceled reservations
        disabled={isCancelled} // Disable TouchableOpacity for canceled reservations
      >
        <Text style={styles.reservationTitle}>Reserva ID: {item.id}</Text>
        <Text style={[styles.reservationStatus, statusStyle]}>
          Estado: {item.status}
        </Text>
        <Text style={styles.reservationTimestamp}>
          Fecha: {item.timestamp?.toDate?.().toLocaleString() || "N/A"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservas realizadas por el cliente</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4f46e5"
          style={styles.loadingSpinner}
        />
      ) : reservations.length > 0 ? (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={renderReservation}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noReservationsText}>
          No tienes reservas realizadas.
        </Text>
      )}

      {product && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Botón de cerrar (cruz) en la esquina superior derecha */}
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => {
                  // Al cerrar, no cancela la reserva, solo cierra el modal
                  setModalVisible(false);
                }}
              >
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Producto reservado:</Text>
              <Image
                source={{ uri: product.images[0] }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price} €</Text>
              <View style={styles.qrContainer}>
                <QRCode
                  value={selectedReservation.id}
                  size={200}
                  backgroundColor="white"
                  color="black"
                />
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelReservation}
              >
                <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4f46e5",
    textAlign: "center",
    marginTop: 32, // Add top margin
    marginBottom: 16,
  },
  loadingSpinner: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { paddingBottom: 16 },
  reservationCard: {
    backgroundColor: "#f0f0f0", // Gray background
    borderRadius: 12, // Rounded corners
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reservationTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  reservationStatus: { fontSize: 14, color: "#666", marginTop: 4 },
  reservationTimestamp: { fontSize: 12, color: "#999", marginTop: 4 },
  noReservationsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4f46e5",
    marginBottom: 16,
    textAlign: "center",
  },
  productImage: { width: 150, height: 150, borderRadius: 10, marginBottom: 16 },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productPrice: { fontSize: 16, color: "#666" },
  qrContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4d4d", // Red background
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
  },
  cancelledReservationCard: {
    opacity: 0.5, // Make canceled reservations transparent
  },
  confirmedStatus: {
    color: "#FFA500", // Orange for confirmed
  },
  completedStatus: {
    color: "#008000", // Green for completed
  },
  cancelledStatus: {
    color: "#FF0000", // Red for cancelled
  },
});
