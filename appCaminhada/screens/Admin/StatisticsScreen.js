import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

// Datos de ejemplo, deberías obtenerlos de Firestore
const ingresosPorMes = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May"],
  datasets: [{ data: [120, 250, 180, 300, 400] }],
};

function ProductosCategoria() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const categoryCounts = {};

      productsSnapshot.forEach((doc) => {
        const product = doc.data();
        const category = product.category || "Otro";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      const formattedData = Object.keys(categoryCounts).map((category, index) => ({
        name: category,
        count: categoryCounts[category],
        color: predefinedColors[index % predefinedColors.length],
        legendFontColor: "#333",
        legendFontSize: 14,
      }));

      setCategoriesData(formattedData);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  const predefinedColors = [
    "#e57373", "#81c784", "#ba68c8", "#7986cb", "#ffb74d", 
    "#f06292", "#4db6ac", "#ffd54f", "#64b5f6", "#a1887f",
  ];

  // Calcular el total para los porcentajes
  const total = categoriesData.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <>
          <View style={styles.chartContainer}>
            <PieChart
              data={categoriesData}
              width={Dimensions.get("window").width + 300}
              height={300}
              chartConfig={{
                color: () => "#333",
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="170"
              absolute={false}
            />
          </View>
          <View style={[styles.legendContainer, { flexDirection: "row", flexWrap: "wrap", columnGap: 16 }]}>
            {categoriesData.map((category, idx) => (
              <View
                key={category.name}
                style={[
                  styles.legendItem,
                  {
                    width: "50%",
                  },
                ]}
              >
                <View
                  style={[styles.colorBox, { backgroundColor: category.color }]}
                />
                <Text style={styles.legendText}>
                  {category.name}: {category.count}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function ReservasEstado() {
  const [reservasData, setReservasData] = useState({
    labels: ["confirmed", "cancelled", "completed"],
    datasets: [{ data: [0, 0, 0] }],
  });
  const [loading, setLoading] = useState(true);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const reservasSnapshot = await getDocs(collection(db, "reservations"));
      const statusCounts = { confirmed: 0, cancelled: 0, completed: 0 };

      reservasSnapshot.forEach((doc) => {
        const reserva = doc.data();
        const status = reserva.status || "Otro";
        if (statusCounts[status] !== undefined) {
          statusCounts[status]++;
        }
      });

      setReservasData({
        labels: Object.keys(statusCounts),
        datasets: [{ data: Object.values(statusCounts) }],
      });
    } catch (error) {
      console.error("Error fetching reservation statuses:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      {loading ? (
        <Text style={{ fontSize: 16, color: "#666", marginTop: 20 }}>
          Cargando...
        </Text>
      ) : (
        <>
          <BarChart
            data={reservasData}
            width={Dimensions.get("window").width - 32}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
              labelColor: () => "#333",
            }}
            style={{ borderRadius: 16 }}
          />
          <Text style={{ marginTop: 16 }}>Reservas por estado</Text>
        </>
      )}
    </View>
  );
}

function Ingresos() {
  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      <LineChart
        data={ingresosPorMes}
        width={Dimensions.get("window").width - 32}
        height={220}
        yAxisLabel="€"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          labelColor: () => "#333",
        }}
        style={{ borderRadius: 16 }}
      />
      <Text style={{ marginTop: 16 }}>Ingresos por mes</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function StatisticsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 40 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#4f46e5",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIndicatorStyle: { backgroundColor: "#4f46e5" },
        }}
      >
        <Tab.Screen name="Productos" component={ProductosCategoria} />
        <Tab.Screen name="Reservas" component={ReservasEstado} />
        <Tab.Screen name="Ingresos" component={Ingresos} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  legendContainer: {
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 16,
    color: "#333",
  },
});
