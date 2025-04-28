import React, { Component } from "react";
import { ScrollView, View, Image, FlatList } from "react-native";
import { Card, Text } from "@rneui/themed";
import Historia from "./HistoriaComponent";
import { baseUrl } from "../comun/comun";
import { connect } from "react-redux";
import IndicadorActividad from "./IndicadorActividadComponent";

const mapStateToProps = (state) => {
  return {
    actividades: state.actividades,
  };
};

class QuienesSomos extends Component {
  renderActividad = ({ item }) => (
    <View style={{ marginBottom: 15 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 20,
        }}
      >
        <Image
          source={{ uri: baseUrl + item.imagen }}
          style={{ width: 40, height: 40, marginRight: 15 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>{item.nombre}</Text>
          <Text>{item.descripcion}</Text>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          marginVertical: 10,
        }}
      />
    </View>
  );

  render() {
    if (this.props.actividades.isLoading) {
      return (
        <ScrollView>
          <Historia />
          <Card>
            <Card.Title>Actividades y recursos</Card.Title>
            <Card.Divider />
            <IndicadorActividad />
          </Card>
        </ScrollView>
      );
    }

    return (
      <ScrollView>
        <View>
          <Historia />
          <Card>
            <Card.Title>Actividades y recursos</Card.Title>
            <Card.Divider />
            <FlatList
              data={this.props.actividades.actividades}
              renderItem={this.renderActividad}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </Card>
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps)(QuienesSomos);
