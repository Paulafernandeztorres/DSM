import React, { Component, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  Button,
} from "react-native";
import { Card, Icon, Input } from "@rneui/themed";
import { baseUrl } from "../comun/comun";
import { connect } from "react-redux";
import { favoritos } from "../redux/favoritos";
import { postFavorito, postComentario } from "../redux/ActionCreators";
import { colorGaztaroaOscuro } from "../comun/comun";
import { Rating } from "react-native-ratings";

const mapStateToProps = (state) => {
  return {
    excursiones: state.excursiones,
    comentarios: state.comentarios,
    favoritos: state.favoritos,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorito: (excursionId) => dispatch(postFavorito(excursionId)),
  postComentario: (comentario) => dispatch(postComentario(comentario)),
});

function RenderExcursion(props) {
  const excursion = props.excursion;
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");

  const resetModal = () => {
    setModalVisible(false);
    setRating(5);
    setAuthor("");
    setComment("");
  };

  const gestionarComentario = () => {
    const newComment = {
      excursionId: props.excursion.id,
      valoracion: rating,
      autor: author,
      comentario: comment,
      dia: new Date().toISOString(),
    };
    props.onSubmitComment(newComment);
    resetModal();
  };

  if (excursion != null) {
    const imageUrl = baseUrl + excursion.imagen;
    return (
      <>
        <Card>
          <View style={styles.cardContainer}>
            <Text style={styles.title}>{excursion.nombre}</Text>
            <View style={styles.dividerContainer}></View>
            <Card.Image source={{ uri: imageUrl }} />
          </View>
          <Text style={styles.description}>{excursion.descripcion}</Text>
          <View style={styles.iconContainer}>
            <Icon
              raised
              reverse
              name={props.favorita ? "heart" : "heart-o"}
              type="font-awesome"
              color="#f50"
              onPress={() => (props.favorita ? null : props.onPress())}
            />
            <Icon
              raised
              reverse
              name="pencil"
              type="font-awesome"
              color={colorGaztaroaOscuro}
              onPress={() => setModalVisible(true)}
            />
          </View>
        </Card>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={resetModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                Rating: <Text style={styles.ratingNumber}>{rating}</Text>/5
              </Text>
              <Rating
                type="star"
                startingValue={rating}
                imageSize={30}
                fractions={0}
                onFinishRating={(value) => setRating(value)}
              />
            </View>
            <Input
              placeholder="Autor"
              leftIcon={{
                type: "font-awesome",
                name: "user",
                containerStyle: styles.iconSpacing,
              }}
              value={author}
              onChangeText={(text) => setAuthor(text)}
              containerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Comentario"
              leftIcon={{
                type: "font-awesome",
                name: "comment",
                containerStyle: styles.iconSpacing,
              }}
              value={comment}
              onChangeText={(text) => setComment(text)}
              multiline
              containerStyle={styles.inputContainer}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="ENVIAR"
                onPress={gestionarComentario}
                color="#0000FF"
              />
              <Button title="CANCELAR" onPress={resetModal} color="#0000FF" />
            </View>
          </View>
        </Modal>
      </>
    );
  } else {
    return <View></View>;
  }
}

function RenderComentario(props) {
  const comentarios = props.comentarios;

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ marginBottom: 5 }}>{item.comentario}</Text>
      <Text style={{ marginBottom: 5 }}>{item.valoracion + " estrellas"}</Text>
      <Text style={{ fontSize: 12 }}>
        {"-- " + item.autor + ", " + item.dia}
      </Text>
    </View>
  );

  return (
    <Card>
      <Card.Title>Comentarios</Card.Title>
      <Card.Divider />
      <FlatList
        data={comentarios}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </Card>
  );
}

class DetalleExcursion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valoracion: 5,
      autor: "",
      comentario: "",
      showModal: false,
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  resetForm() {
    this.setState({
      valoracion: 3,
      autor: "",
      comentario: "",
      showModal: false,
    });
  }

  gestionarComentario(nuevoComentario) {
    this.props.postComentario(nuevoComentario);
  }

  marcarFavorito(excursionId) {
    this.props.postFavorito(excursionId);
  }

  render() {
    const { excursionId } = this.props.route.params;
    const excursion = this.props.excursiones.excursiones[+excursionId];
    const comentarios = this.props.comentarios.comentarios.filter(
      (comentario) => comentario.excursionId === +excursionId
    );

    return (
      <ScrollView>
        <RenderExcursion
          excursion={excursion}
          favorita={this.props.favoritos.favoritos.some(
            (el) => el === excursionId
          )}
          onPress={() => this.marcarFavorito(excursionId)}
          onSubmitComment={(nuevoComentario) =>
            this.gestionarComentario(nuevoComentario)
          }
        />
        <RenderComentario comentarios={comentarios} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    top: 40,
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    zIndex: 1,
  },
  description: {
    margin: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    margin: 20,
    justifyContent: "flex-start",
    marginTop: 80,
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 24,
    color: "#FFD700",
    marginBottom: 10,
  },
  ratingNumber: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFD700",
  },
  iconSpacing: {
    marginRight: 10,
  },
  inputContainer: {
    marginBottom: 20,
    width: "80%",
  },
  buttonContainer: {
    alignItems: "center",
    width: "80%",
  },
  buttonSpacing: {
    height: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DetalleExcursion);
