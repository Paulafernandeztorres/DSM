import { useRef, useState } from "react";
import { Pressable, View, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const CameraComponent = ({ onClose, onPictureTaken }) => {
  const [permission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [uri, setUri] = useState(null);
  const [facing, setFacing] = useState("back");

  if (!permission?.granted) {
    return null;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setUri(photo.uri);
      if (onPictureTaken) onPictureTaken(photo.uri);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

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
    >
      <View style={styles.shutterContainer}>
        <Pressable onPress={onClose} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={32} color="white" />
        </Pressable>
        <Pressable onPress={takePicture}>
          <View style={styles.shutterBtn}>
            <View style={styles.shutterBtnInner} />
          </View>
        </Pressable>
        <Pressable onPress={toggleFacing} style={styles.flipButton}>
          <FontAwesome6 name="arrow-rotate-left" size={32} color="white" />
        </Pressable>
      </View>
    </CameraView>
  );
};

const styles = {
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
  backButton: {
    alignItems: "center",
    justifyContent: "center",
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
};

export default CameraComponent;
