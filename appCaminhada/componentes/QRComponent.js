import { useRef, useState } from "react";
import { Pressable, View, Text, StyleSheet, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const QRComponent = ({ onCodeScanned, onCancel }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [scanned, setScanned] = useState(false);

  if (!permission?.granted) {
    requestPermission();
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Se necesita permiso para acceder a la cámara.
        </Text>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      onCodeScanned && onCodeScanned(data);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        mode="barCodeScanner"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.scanOverlay}>
          <Text style={styles.scanText}>Escanea un código QR</Text>
        </View>
      </CameraView>
      <Button title="Cancelar" onPress={onCancel} color="#f55" />
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  scanOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  scanText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QRComponent;
