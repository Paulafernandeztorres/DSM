import { useRef, useState, useEffect } from "react";
import { Pressable, View, Button, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

function CameraLogic() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [uri, setUri] = useState(null);
  const [facing, setFacing] = useState("back");
  const [scanEnabled, setScanEnabled] = useState(true);
  const [lastScannedData, setLastScannedData] = useState(null); // Almacena el último código escaneado
  const [lastScannedTime, setLastScannedTime] = useState(0); // Almacena el momento del último escaneo

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setUri(photo.uri);
      return photo.uri;
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanEnabled) return;

    const now = Date.now();
    // Evita escaneos duplicados:
    // - Mismo código que el anterior
    // - Y menos de 2 segundos desde el último escaneo
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
    uri,
    setUri,
    facing,
    scanEnabled,
    setScanEnabled,
    takePicture,
    toggleFacing,
    handleBarCodeScanned,
  };
}

const CameraComponent = ({ onClose, onPictureTaken }) => {
  const {
    permission,
    cameraRef,
    uri,
    setUri,
    facing,
    scanEnabled,
    setScanEnabled,
    takePicture,
    toggleFacing,
    handleBarCodeScanned,
  } = CameraLogic();

  if (!permission?.granted) {
    return null;
  }

  if (uri) {
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button title="Tomar otra foto" onPress={() => setUri(null)} />
      </View>
    );
  }

  return (
    <CameraView
      ref={cameraRef}
      style={{ flex: 1, width: "100%" }}
      facing={facing}
      mode="picture"
      barcodeScannerSettings={{
        barcodeTypes: [
          "qr",
          "pdf417",
          "upc_e",
          "upc_a",
          "ean8",
          "ean13",
          "code39",
          "code93",
          "code128",
          "itf14",
          "codabar",
        ],
      }}
      onBarcodeScanned={scanEnabled ? handleBarCodeScanned : undefined}
    >
      <View style={styles.shutterContainer}>
        <Pressable onPress={onClose} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={32} color="white" />
        </Pressable>

        <View style={styles.middleButtons}>
          <Pressable
            onPress={() => setScanEnabled(!scanEnabled)}
            style={styles.scanButton}
          >
            <FontAwesome6
              name={scanEnabled ? "qrcode" : "camera"}
              size={32}
              color="white"
            />
          </Pressable>

          {!scanEnabled && (
            <Pressable
              onPress={async () => {
                const uri = await takePicture();
                if (onPictureTaken) onPictureTaken(uri);
              }}
            >
              <View style={styles.shutterBtn}>
                <View style={styles.shutterBtnInner} />
              </View>
            </Pressable>
          )}
        </View>

        <Pressable onPress={toggleFacing} style={styles.flipButton}>
          <FontAwesome6 name="arrow-rotate-left" size={32} color="white" />
        </Pressable>
      </View>

      {scanEnabled && (
        <View style={styles.scanOverlay}>
          <Text style={styles.scanText}>
            Modo Escáner - Apunta a un código QR
          </Text>
        </View>
      )}
    </CameraView>
  );
};

const styles = StyleSheet.create({
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  middleButtons: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  scanButton: {
    marginBottom: 20,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
  flipButton: {
    alignItems: "center",
    justifyContent: "center",
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

export default CameraComponent;
