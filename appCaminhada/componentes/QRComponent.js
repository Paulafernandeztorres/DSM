import { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const QRComponent = ({ onCodeScanned }) => {
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
    <View style={styles.cameraWrapper}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="barCodeScanner"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Escanea un código QR</Text>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraWrapper: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 10,
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 8,
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
  },
  permissionContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default QRComponent;
