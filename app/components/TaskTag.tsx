import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const TaskTag = ({ text, color }: { text: string; color: string }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={styles.tagText}>{text}</Text>
  </View>
);

export default TaskTag;

const styles = StyleSheet.create({
  tag: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: "bold",
  },
});
