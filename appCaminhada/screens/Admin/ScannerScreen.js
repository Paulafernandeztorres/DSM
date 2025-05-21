import React from "react";
import { View, StyleSheet } from "react-native";
import QRComponent from "../../componentes/QRComponent";

export default function ScannerScreen() {
  return (
    <View style={styles.container}>
      <QRComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
