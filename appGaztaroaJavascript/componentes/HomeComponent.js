import React, { Component } from "react";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { Divider } from "@rneui/base";
import { baseUrl } from "../comun/comun";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    excursiones: state.excursiones,
    cabeceras: state.cabeceras,
    actividades: state.actividades,
  };
};

function RenderItem(props) {
  const item = props.item;

  if (item != null) {
    return (
      <Card>
        <Card.Divider />
        <View style={styles.cardContainer}>
          <Text style={styles.title}>{item.nombre}</Text>
          <Card.Image source={{ uri: baseUrl + item.imagen }} />
        </View>
        <Text style={styles.description}>{item.descripcion}</Text>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

class Home extends Component {
  render() {
    return (
      <ScrollView>
        <RenderItem
          item={
            this.props.cabeceras.cabeceras.filter(
              (cabecera) => cabecera.destacado
            )[0]
          }
        />
        <RenderItem
          item={
            this.props.excursiones.excursiones.filter(
              (excursion) => excursion.destacado
            )[0]
          }
        />
        <RenderItem
          item={
            this.props.actividades.actividades.filter(
              (actividad) => actividad.destacado
            )[0]
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

export default connect(mapStateToProps)(Home);
