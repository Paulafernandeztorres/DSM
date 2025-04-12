import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { EXCURSIONES } from "../comun/excursiones";
import { ScrollView, FlatList } from "react-native";
import { COMENTARIOS } from "../comun/comentarios";
import { Card, Icon } from "@rneui/themed";
import { baseUrl } from "../comun/comun";

function RenderExcursion(props) {
  const excursion = props.excursion;

  if (excursion != null) {
    const imageUrl = baseUrl + excursion.imagen;
    console.log("Image URL:", imageUrl);
    return (
      <Card>
        <View style={styles.cardContainer}>
          <Text style={styles.title}>{excursion.nombre}</Text>
          <View style={styles.dividerContainer}></View>
          <Card.Image source={{ uri: imageUrl }} />
        </View>
        <Text style={styles.description}>{excursion.descripcion}</Text>
        <Icon
          raised
          reverse
          name={props.favorita ? "heart" : "heart-o"}
          type="font-awesome"
          color="#f50"
          onPress={() =>
            props.favorita
              ? console.log("La excursión ya se encuentra entre las favoritas")
              : props.onPress()
          }
        />
      </Card>
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
      excursiones: EXCURSIONES,
      comentarios: COMENTARIOS,
      favoritos: [],
    };
  }

  marcarFavorito(excursionId) {
    this.setState({
      favoritos: this.state.favoritos.concat(excursionId),
    });
  }

  render() {
    const { excursionId } = this.props.route.params;

    return (
      <ScrollView>
        <RenderExcursion
          excursion={this.state.excursiones[+excursionId]}
          favorita={this.state.favoritos.some((el) => el === excursionId)}
          onPress={() => this.marcarFavorito(excursionId)}
        />
        <RenderComentario
          comentarios={this.state.comentarios.filter(
            (comentario) => comentario.excursionId === excursionId
          )}
        />
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
});

export default DetalleExcursion;
