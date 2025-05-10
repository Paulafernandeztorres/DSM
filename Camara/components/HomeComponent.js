import { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import CameraComponent from "./CameraComponent";

function HomeLogic() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  return {
    isCameraOpen,
    setIsCameraOpen,
    capturedImage,
    setCapturedImage,
  };
}

export default function Home() {
  const { isCameraOpen, setIsCameraOpen, capturedImage, setCapturedImage } =
    HomeLogic();

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <CameraComponent
          onClose={() => setIsCameraOpen(false)}
          onPictureTaken={(uri) => setCapturedImage(uri)}
        />
      ) : (
        <Button title="Abrir Cámara" onPress={() => setIsCameraOpen(true)} />
      )}

      {capturedImage && !isCameraOpen && (
        <View style={styles.preview}>
          <Image source={{ uri: capturedImage }} style={styles.image} />
          <Button title="Borrar foto" onPress={() => setCapturedImage(null)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});
