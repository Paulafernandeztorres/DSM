import React, { Component } from "react";
import { ScrollView, View, StyleSheet, Text, Button } from "react-native";
import { Image } from "react-native";
import CameraComponent from "./CameraComponent";

// Functional component to render the captured image preview.
function RenderItem(props) {
  const { capturedImage, onDelete } = props; // Destructure props to get the captured image URI and delete handler.

  if (capturedImage) {
    // If there is a captured image, render the preview.
    return (
      <View style={styles.preview}>
        <Image source={{ uri: capturedImage }} style={styles.image} />
        {/* Display the captured image. */}
        <Button title="Borrar foto" onPress={onDelete} />
        {/* Button to delete the captured image. */}
      </View>
    );
  } else {
    return <View></View>; // If no image is captured, render an empty view.
  }
}

// Class-based component for the Home screen.
class HomeComponent extends Component {
  constructor(props) {
    super(props);
    // Initialize the state with default values.
    this.state = {
      isCameraOpen: false, // Boolean to track if the camera is open.
      capturedImage: null, // URI of the captured image.
      gallery: [], // Array to store URIs of captured images.
      isGalleryOpen: false, // Boolean to track if the gallery is open.
    };
  }

  render() {
    if (this.state.isGalleryOpen) {
      // Render the gallery view.
      return (
        <ScrollView contentContainerStyle={styles.galleryContainer}>
          {this.state.gallery.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.galleryImage} />
          ))}
          <Button
            title="Volver"
            onPress={() => this.setState({ isGalleryOpen: false })}
          />
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* If the camera is open, render the CameraComponent. */}
        {this.state.isCameraOpen ? (
          <CameraComponent
            onClose={() => this.setState({ isCameraOpen: false })} // Close the camera when the user presses the back button.
            onPictureTaken={(uri) =>
              this.setState((prevState) => ({
                capturedImage: uri,
                gallery: [...prevState.gallery, uri], // Add the captured image to the gallery.
              }))
            }
          />
        ) : (
          // If the camera is not open, show buttons to open it or view the gallery.
          <View>
            <Button
              title="Abrir Cámara"
              onPress={() => this.setState({ isCameraOpen: true })}
            />
            <Button
              title="Ver Galería"
              onPress={() => this.setState({ isGalleryOpen: true })}
            />
          </View>
        )}

        {/* If the camera is not open, render the captured image preview. */}
        {!this.state.isCameraOpen && (
          <RenderItem
            capturedImage={this.state.capturedImage} // Pass the captured image URI to RenderItem.
            onDelete={() => this.setState({ capturedImage: null })} // Clear the captured image when the delete button is pressed.
          />
        )}
      </ScrollView>
    );
  }
}

// Styles for the component.
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  galleryContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default HomeComponent; // Export the HomeComponent as the default export.
