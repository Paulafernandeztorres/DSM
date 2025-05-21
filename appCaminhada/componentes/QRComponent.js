import { useRef, useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

function CameraLogic() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [lastScannedData, setLastScannedData] = useState(null);
  const [lastScannedTime, setLastScannedTime] = useState(0);

  const handleBarCodeScanned = ({ type, data }) => {
    const now = Date.now();
    if (data === lastScannedData && now - lastScannedTime < 2000) {
      return;
    }
    setLastScannedData(data);
    setLastScannedTime(now);
    alert(`Código escaneado!\nTipo: ${type}\nDatos: ${data}`);
  };

  if (permission?.granted === false) {
    requestPermission();
  }

  return {
    permission,
    cameraRef,
    handleBarCodeScanned,
  };
}

const QRComponent = () => {
  const { permission, cameraRef, handleBarCodeScanned } = CameraLogic();

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Se necesita permiso para acceder a la cámara.
        </Text>
      </View>
    );
  }

  return (
    <CameraView
      ref={cameraRef}
      style={{ flex: 1 }}
      facing="back"
      mode="barCodeScanner"
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={handleBarCodeScanned}
    >
      <View style={styles.scanOverlay}>
        <Text style={styles.scanText}>Escanea un código QR</Text>
      </View>
    </CameraView>
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