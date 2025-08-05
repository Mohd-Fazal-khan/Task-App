import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Dimensions } from "react-native";
import Colors from "../constants/Colors";

const { width, height } = Dimensions.get("window");


export default function FilterModal({
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  onClose,
}) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>Filter Tasks</Text>

        <Text style={styles.label}>Status:</Text>
        <View style={styles.row}>
          {["all", "completed", "incomplete"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.option,
                filterStatus === status && styles.selectedOption,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={styles.optionText}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Priority:</Text>
        <View style={styles.row}>
          {["all", "high", "medium", "low"].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.option,
                filterPriority === priority && styles.selectedOption,
              ]}
              onPress={() => setFilterPriority(priority)}
            >
              <Text style={styles.optionText}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modal: {
    backgroundColor: Colors.cardBackground,
    borderRadius: width * 0.05,
    padding: width * 0.06,
    minWidth: width * 0.7,
    maxWidth: width * 0.9,
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: Colors.primaryPurple,
    textAlign: "center",
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: Colors.textDark,
    marginTop: height * 0.01,
    marginBottom: height * 0.008,
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: height * 0.01,
    justifyContent: "center",
  },
  option: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: width * 0.03,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    marginHorizontal: width * 0.015,
    marginVertical: height * 0.005,
    borderWidth: 1,
    borderColor: Colors.lightPurple,
  },
  selectedOption: {
    backgroundColor: Colors.primaryPurple,
    borderColor: Colors.primaryPurple,
  },
  optionText: {
    color: Colors.textDark,
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  closeBtn: {
    marginTop: height * 0.02,
    backgroundColor: Colors.primaryPurple,
    borderRadius: width * 0.03,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.07,
  },
  closeText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
});
