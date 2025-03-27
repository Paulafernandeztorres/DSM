import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import React from "react";
import Campobase from "./componentes/CampobaseComponent";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function App() {
  return (
    <SafeAreaProvider>
      <View>
        <Campobase />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}
