import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

const LetsGoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainIconContainer}>
          <Image
            source={require("../../../assets/images/img.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Get things done.</Text>
        <Text style={styles.description}>
          Just a click away from planning your tasks.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.curvedBackground} />
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <MaterialCommunityIcons name="arrow-right" size={width * 0.2} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LetsGoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: height * 0.1,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: width * 0.1,
  },
  mainIconContainer: {
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  image: {
    height: height * 0.25,
    width: width * 0.5,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: Colors.textDark,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: width * 0.04,
    color: Colors.textLight,
    textAlign: "center",
   lineHeight: width * 0.06, 
  paddingBottom: 5,   
    marginBottom: height * 0.05,
  },
  bottomSection: {
    width: "100%",
    alignItems: "flex-end",
    position: "relative",
    paddingBottom: Platform.OS === "ios" ? 32 : 16, 
    minHeight: width * 0.25, 
  },
  curvedBackground: {
    position: "absolute",
    bottom: -width * 0.25, 
    right: -width * 0.15,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: Colors.primaryPurple,
    zIndex: 0,
  },
  nextButton: {
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: width * 0.08,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.06,
    marginBottom: 8,
    backgroundColor: Colors.primaryPurple,
    
  },
});
