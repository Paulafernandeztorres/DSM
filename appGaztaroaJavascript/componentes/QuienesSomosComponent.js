import React, { Component } from "react";
import { ScrollView, View, Image, FlatList } from "react-native";
import { Card, Text } from "@rneui/themed";
import Historia from "./HistoriaComponent";
import { ACTIVIDADES } from "../comun/actividades";

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
          source={require("./imagenes/40Años.png")}
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
    return (
      <ScrollView>
        <View>
          <Historia />

          <Card>
            <Card.Title>Actividades y recursos</Card.Title>
            <Card.Divider />
            <FlatList
              data={ACTIVIDADES}
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

export default QuienesSomos;
