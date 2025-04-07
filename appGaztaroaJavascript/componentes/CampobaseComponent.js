import React, { Component } from "react";
import Constants from "expo-constants";
import { Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Componentes individuales
import Calendario from "./CalendarioComponent";
import DetalleExcursion from "./DetalleExcursionComponent";
import Home from "./HomeComponent";
import ContactoInfo from "./ContactoComponent";
import QuienesSomosInfo from "./QuienesSomosComponent";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeNavegador() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: "#015afc" },
        headerTitleStyle: { color: "#fff" },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: "Campo Base" }}
      />
    </Stack.Navigator>
  );
}

function CalendarioNavegador() {
  return (
    <Stack.Navigator
      initialRouteName="Calendar"
      screenOptions={{
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: "#015afc" },
        headerTitleStyle: { color: "#fff" },
      }}
    >
      <Stack.Screen
        name="Calendar"
        component={Calendario}
        options={{ title: "Calendario Gaztaroa" }}
      />
      <Stack.Screen
        name="DetalleExcursion"
        component={DetalleExcursion}
        options={{ title: "Detalle Excursión" }}
      />
    </Stack.Navigator>
  );
}

function ContactoNavegador() {
  return (
    <Stack.Navigator
      initialRouteName="ContactoInfo"
      screenOptions={{
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: "#015afc" },
        headerTitleStyle: { color: "#fff" },
      }}
    >
      <Stack.Screen
        name="ContactoInfo"
        component={ContactoInfo}
        options={{ title: "Contacto" }}
      />
    </Stack.Navigator>
  );
}

function QuienesSomosNavegador() {
  return (
    <Stack.Navigator
      initialRouteName="QuienesSomosInfo"
      screenOptions={{
        headerTintColor: "#fff",
        headerStyle: { backgroundColor: "#015afc" },
        headerTitleStyle: { color: "#fff" },
      }}
    >
      <Stack.Screen
        name="QuienesSomosInfo"
        component={QuienesSomosInfo}
        options={{ title: "Quiénes somos" }}
      />
    </Stack.Navigator>
  );
}

function DrawerNavegador() {
  return (
    <Drawer.Navigator
      initialRouteName="Campo base"
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#c2d3da" },
      }}
    >
      <Drawer.Screen name="Campo base" component={HomeNavegador} />
      <Drawer.Screen name="Quienes somos" component={QuienesSomosNavegador} />
      <Drawer.Screen name="Calendario" component={CalendarioNavegador} />
      <Drawer.Screen name="Contacto" component={ContactoNavegador} />
    </Drawer.Navigator>
  );
}

class Campobase extends Component {
  render() {
    return (
      <NavigationContainer>
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
          }}
        >
          <DrawerNavegador />
        </View>
      </NavigationContainer>
    );
  }
}

export default Campobase;
