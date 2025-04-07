import React, { Component } from "react";
import { ScrollView, View, Image } from "react-native";
import { Card, Text } from "@rneui/themed";
import Historia from "./HistoriaComponent";
import { ACTIVIDADES } from "../comun/actividades";

class QuienesSomos extends Component {
  render() {
    return (
      <ScrollView>
        <View>
          <Historia />

          <Card>
            <Card.Title>Actividades y recursos</Card.Title>
            <Card.Divider />
            {ACTIVIDADES.map((actividad, index) => (
              <View key={index} style={{ marginBottom: 15 }}>
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
                    <Text style={{ fontSize: 16 }}>{actividad.nombre}</Text>
                    <Text>{actividad.descripcion}</Text>
                  </View>
                </View>
                {index < ACTIVIDADES.length - 1 && (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#ddd",
                      marginVertical: 10,
                    }}
                  />
                )}
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    );
  }
}

export default QuienesSomos;
