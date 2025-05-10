import { useRef, useState } from "react";
import { Pressable, View, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

function CameraLogic() {
  // Encapsulate the camera logic in a reusable function.
  const [permission] = useCameraPermissions(); // Request and store camera permissions.
  const cameraRef = useRef(null); // Create a reference to the camera instance.
  const [uri, setUri] = useState(null); // State to store the URI of the captured image.
  const [facing, setFacing] = useState("back"); // State to track the camera's facing direction (front or back).

  const takePicture = async () => {
    // Function to capture a picture.
    if (cameraRef.current) {
      // Check if the camera reference is available.
      const photo = await cameraRef.current.takePictureAsync(); // Capture the picture.
      setUri(photo.uri); // Update the state with the captured image URI.
      return photo.uri; // Return the URI for further use.
    }
  };

  const toggleFacing = () => {
    // Function to toggle the camera's facing direction.
    setFacing((prev) => (prev === "back" ? "front" : "back")); // Switch between "back" and "front".
  };

  return {
    // Return the logic and state variables for use in the component.
    permission,
    cameraRef,
    uri,
    setUri,
    facing,
    takePicture,
    toggleFacing,
  };
}

const CameraComponent = ({ onClose, onPictureTaken }) => {
  // Define the CameraComponent, receiving props for closing the camera and handling captured images.
  const {
    permission,
    cameraRef,
    uri,
    setUri,
    facing,
    takePicture,
    toggleFacing,
  } = CameraLogic(); // Use the CameraLogic function to manage state and logic.

  if (!permission?.granted) {
    // If camera permissions are not granted, render nothing.
    return null;
  }

  if (uri) {
    // If an image has been captured, render the preview.
    return (
      <View>
        <Image
          source={{ uri }} // Display the captured image using its URI.
          contentFit="contain" // Ensure the image fits within its container.
          style={{ width: 300, aspectRatio: 1 }} // Set the image dimensions.
        />
        <Button title="Tomar otra foto" onPress={() => setUri(null)} />{" "}
        {/* Button to retake the photo. */}
      </View>
    );
  }

  return (
    <CameraView
      ref={cameraRef} // Attach the camera reference.
      style={{ flex: 1, width: "100%" }} // Set the camera view to fill the screen.
      facing={facing} // Set the camera's facing direction.
      mode="picture" // Set the camera mode to capture pictures.
    >
      <View style={styles.shutterContainer}>
        {/* Render the camera controls. */}
        <Pressable onPress={onClose} style={styles.backButton}>
          {/* Button to close the camera. */}
          <FontAwesome6 name="arrow-left" size={32} color="white" />
        </Pressable>
        <Pressable
          onPress={async () => {
            // Button to capture a picture.
            const uri = await takePicture(); // Capture the picture.
            if (onPictureTaken) onPictureTaken(uri); // Pass the URI to the parent component if a callback is provided.
          }}
        >
          <View style={styles.shutterBtn}>
            {/* Outer circle of the shutter button. */}
            <View style={styles.shutterBtnInner} />{" "}
            {/* Inner circle of the shutter button. */}
          </View>
        </Pressable>
        <Pressable onPress={toggleFacing} style={styles.flipButton}>
          {/* Button to toggle the camera's facing direction. */}
          <FontAwesome6 name="arrow-rotate-left" size={32} color="white" />
        </Pressable>
      </View>
    </CameraView>
  );
};

const styles = {
  // Define styles for the camera component.
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

export default CameraComponent; // Export the CameraComponent as the default export.
