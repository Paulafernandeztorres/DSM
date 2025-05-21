import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StatisticsScreen from "./Admin/StatisticsScreen";
import ScannerScreen from "./Admin/ScannerScreen";
import AdminScreen from "./Admin/AdminScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 65,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Statistics") iconName = "bar-chart";
          else if (route.name === "Scanner") iconName = "camera";
          else if (route.name === "Admin") iconName = "settings";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: "Estadísticas" }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: "Escanear" }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: "Administrar" }}
      />
    </Tab.Navigator>
  );
}
