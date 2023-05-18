import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function Details({ data, remove, update }) {
  const [color, setColor] = useState("#e0e1e4");
  const [selectedId, setSelectedId] = useState(null);
  function handleClick() {
    remove(data);
  }

  function isColor() {
    if (selectedId === data.id) {
      setColor("#e0e1e4");
      setSelectedId(null);
      update("");
    } else {
      setColor("#158c15");
      setSelectedId(data.id);
      update(data);
    }
  }

  useEffect(() => {
    if (selectedId && selectedId !== data.id) {
      setColor("#e0e1e4");
      setSelectedId(null);
      update("");
    }
  }, [selectedId, data.id]);

  return (
    <TouchableOpacity
      style={styles.btnUpdate}
      onPress={isColor}
      disabled={selectedId !== null && selectedId !== data.id}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{data.title}</Text>
          <Text/>
          <Text style={styles.text}>{data.inputValue}</Text>
        </View>
        <TouchableOpacity style={styles.iconContainer} onPress={handleClick}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.updateArea}>
      <AntDesign name="circledown" size={20} color={color} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    width: 350,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 350,
    height: 120,
    padding: 20,
  },
  textContainer: {
    flex: 1,
  },
  iconContainer: {
    marginTop: -60,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#6196f1",
  },
  btnUpdate: {
    flex: 1,
    paddingBottom: 20,
  },
  updateArea: {
    flexDirection: "row-reverse",
    marginTop: -30,
    width: 330,
  },
});
