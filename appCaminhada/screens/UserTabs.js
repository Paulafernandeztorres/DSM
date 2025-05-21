import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "./UserScreen";
import BookingsScreen from "./BookingsScreen";
import SearchScreen from "./SearchScreen";
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
          if (route.name === "Search") iconName = "search";
          else if (route.name === "Bookings") iconName = "receipt";
          else if (route.name === "User") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ title: "Reservas" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Buscar" }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{ title: "Usuario" }}
      />
    </Tab.Navigator>
  );
}
