import React from "react";
import { View, Text, Dimensions, ScrollView, SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";

// Datos de ejemplo, deberías obtenerlos de Firestore
const productosPorCategoria = [
  {
    name: "Bicicletas",
    count: 12,
    color: "#4f46e5",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Kayaks",
    count: 7,
    color: "#22c55e",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Patines",
    count: 5,
    color: "#f59e42",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
];

const reservasPorEstado = {
  labels: ["Pendiente", "Confirmada", "Cancelada", "Completada"],
  datasets: [{ data: [8, 15, 3, 10] }],
};

const ingresosPorMes = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May"],
  datasets: [{ data: [120, 250, 180, 300, 400] }],
};

function ProductosCategoria() {
  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      <PieChart
        data={productosPorCategoria}
        width={Dimensions.get("window").width - 32}
        height={220}
        chartConfig={{
          color: () => "#333",
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="16"
        absolute
      />
      <Text style={{ marginTop: 16 }}>Productos por categoría</Text>
    </View>
  );
}

function ReservasEstado() {
  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      <BarChart
        data={reservasPorEstado}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 24 }}>
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
    </SafeAreaView>
  );
}
