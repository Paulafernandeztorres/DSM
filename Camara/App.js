import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null);
  const [facing, setFacing] = useState("back");
  const [cameraOpen, setCameraOpen] = useState(false);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
    console.log(facing);
  };

  const renderPicture = () => {
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
      </View>
    );
  };

  const renderCamera = () => (
    <CameraView
      style={styles.camera}
      ref={ref}
      type={facing}
      mode="picture"
      onCameraReady={() => console.log("Camera is ready")}
    >
      <View style={styles.shutterContainer}>
        <Pressable
          onPress={() => setCameraOpen(false)}
          style={styles.backButton}
        >
          <FontAwesome6 name="arrow-left" size={32} color="white" />
        </Pressable>
        <Pressable onPress={takePicture}>
          {({ pressed }) => (
            <View
              style={[
                styles.shutterBtn,
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.shutterBtnInner,
                  {
                    backgroundColor: "white",
                  },
                ]}
              />
            </View>
          )}
        </Pressable>
        <Pressable onPress={toggleFacing} style={styles.flipButton}>
          <FontAwesome6 name="arrow-rotate-left" size={32} color="white" />
        </Pressable>
      </View>
    </CameraView>
  );

  return (
    <View style={styles.container}>
      {cameraOpen ? (
        uri ? (
          renderPicture()
        ) : (
          renderCamera()
        )
      ) : (
        <Button title="Open Camera" onPress={() => setCameraOpen(true)} />
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
  camera: {
    flex: 1,
    width: "100%",
  },
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
  },
  flipButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});
