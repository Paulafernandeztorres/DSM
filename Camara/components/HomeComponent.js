import React, { Component } from "react";
import { ScrollView, View, StyleSheet, Text, Button } from "react-native";
import { Image } from "react-native";
import CameraComponent from "./CameraComponent";

function RenderItem(props) {
  const { capturedImage, onDelete } = props;

  if (capturedImage) {
    return (
      <View style={styles.preview}>
        <Image source={{ uri: capturedImage }} style={styles.image} />
        <Button title="Borrar foto" onPress={onDelete} />
      </View>
    );
  } else {
    return <View></View>;
  }
}

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCameraOpen: false,
      capturedImage: null,
    };
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.state.isCameraOpen ? (
          <CameraComponent
            onClose={() => this.setState({ isCameraOpen: false })}
            onPictureTaken={(uri) => this.setState({ capturedImage: uri })}
          />
        ) : (
          <Button
            title="Abrir Cámara"
            onPress={() => this.setState({ isCameraOpen: true })}
          />
        )}

        {!this.state.isCameraOpen && (
          <RenderItem
            capturedImage={this.state.capturedImage}
            onDelete={() => this.setState({ capturedImage: null })}
          />
        )}
      </ScrollView>
    );
  }
}

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
});

export default HomeComponent;
