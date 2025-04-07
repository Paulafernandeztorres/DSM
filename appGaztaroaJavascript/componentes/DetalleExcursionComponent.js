import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { EXCURSIONES } from "../comun/excursiones";

function RenderExcursion(props) {
  const excursion = props.excursion;

  if (excursion != null) {
    return (
      <Card>
        <View style={styles.cardContainer}>
          <Text style={styles.title}>{excursion.nombre}</Text>
          <View style={styles.dividerContainer}></View>
          <Card.Image source={require("./imagenes/40Años.png")} />
        </View>
        <Text style={styles.description}>{excursion.descripcion}</Text>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

class DetalleExcursion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      excursiones: EXCURSIONES,
    };
  }

  render() {
    const { excursionId } = this.props.route.params;
    return <RenderExcursion excursion={this.state.excursiones[+excursionId]} />;
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    top: 40,
    fontSize: 30,
    color: "chocolate",
    fontWeight: "bold",
    zIndex: 1,
  },
  description: {
    margin: 20,
  },
});

export default DetalleExcursion;
