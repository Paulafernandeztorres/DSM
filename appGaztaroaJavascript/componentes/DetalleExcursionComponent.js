import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, FlatList } from "react-native";
import { Card, Icon } from "@rneui/themed";
import { baseUrl } from "../comun/comun";
import { connect } from "react-redux";
import { favoritos } from "../redux/favoritos";
import { postFavorito } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    excursiones: state.excursiones,
    comentarios: state.comentarios,
    favoritos: state.favoritos,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorito: (excursionId) => dispatch(postFavorito(excursionId)),
});

function RenderExcursion(props) {
  const excursion = props.excursion;

  if (excursion != null) {
    const imageUrl = baseUrl + excursion.imagen;
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
  marcarFavorito(excursionId) {
    this.props.postFavorito(excursionId);
  }

  render() {
    const { excursionId } = this.props.route.params;
    const excursion = this.props.excursiones.excursiones[+excursionId];
    const comentarios = this.props.comentarios.comentarios.filter(
      (comentario) => comentario.excursionId === excursionId
    );

    return (
      <ScrollView>
        <RenderExcursion
          excursion={this.props.excursiones.excursiones[+excursionId]}
          favorita={this.props.favoritos.favoritos.some(
            (el) => el === excursionId
          )}
          onPress={() => this.marcarFavorito(excursionId)}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DetalleExcursion);
