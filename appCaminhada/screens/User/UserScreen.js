import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/authSlice";
import { collection, getDocs } from "firebase/firestore";

export default function UserScreen({ navigation }) {
  const dispatch = useDispatch();
  const { name, email, role, currentUserId } = useSelector((state) => state.auth); // Include currentUserId
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const favoritesSnapshot = await getDocs(collection(db, "favorites"));
      const favoritesData = favoritesSnapshot.docs
        .filter((doc) => doc.data().userId === currentUserId)
        .map((doc) => doc.data().productId);

      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const favoriteProducts = productsData.filter((product) =>
        favoritesData.includes(product.id)
      );
      setFavorites(favoriteProducts);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      Alert.alert("Error", "No se pudieron cargar los favoritos.");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchFavorites(); // Refresh the page when entering the screen
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      alert(error.message);
    }
  };

  const renderFavorite = ({ item }) => (
    <View style={styles.favoriteCard}>
      <Image source={{ uri: item.images[0] }} style={styles.favoriteImage} />
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteName}>{item.name}</Text>
        <Text style={styles.favoritePrice}>{item.price} €</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Bienvenido, {name}!</Text>
      </View>
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardInfo}>Correo: {email}</Text>
        <Text style={styles.cardInfo}>Rol: {role}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Tus productos favoritos</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavorite}
        contentContainerStyle={styles.favoritesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: "#4f46e5",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 18, 
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 10,
  },
  userCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -20,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  userAvatar: {
    backgroundColor: "#4f46e5",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardInfo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  logoutButton: {
    backgroundColor: "#f59e0b",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  favoritesList: {
    paddingHorizontal: 16,
  },
  favoriteCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  favoritePrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
