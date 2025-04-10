import React, { Component } from "react";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { EXCURSIONES } from "../comun/excursiones";
import { CABECERAS } from "../comun/cabeceras";
import { ACTIVIDADES } from "../comun/actividades";
import { Divider } from "@rneui/base";

function RenderItem(props) {
  const item = props.item;

  if (item != null) {
    return (
      <Card>
        <Card.Divider />
        <View style={styles.cardContainer}>
          <Text style={styles.title}>{item.nombre}</Text>
          <Card.Image source={require("./imagenes/40Años.png")} />
        </View>
        <Text style={styles.description}>{item.descripcion}</Text>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      excursiones: EXCURSIONES,
      cabeceras: CABECERAS,
      actividades: ACTIVIDADES,
    };
  }

  render() {
    return (
      <ScrollView>
        <RenderItem
          item={
            this.state.cabeceras.filter((cabecera) => cabecera.destacado)[0]
          }
        />
        <RenderItem
          item={
            this.state.excursiones.filter((excursion) => excursion.destacado)[0]
          }
        />
        <RenderItem
          item={
            this.state.actividades.filter((actividad) => actividad.destacado)[0]
          }
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
    color: "chocolate",
    fontWeight: "bold",
    zIndex: 1,
  },
  description: {
    margin: 20,
  },
});

export default Home;
