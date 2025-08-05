import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const router = useRouter();  

  const handlePasswordReset = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      return Alert.alert("Missing Field", "Please enter your email.");
    }

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      Alert.alert(
        "Email Sent",
        "A password reset link has been sent to your email."
      );
      router.replace('/screens/auth/LoginScreen'); 
    } catch (error) {
      console.log("Reset error", error.message);
      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/user-not-found") {
        message = "No user found with this email.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      Alert.alert("Reset Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Forgot Your Password?</Text>
        <Text style={styles.subtitle}>
          Enter your Gmail address below to receive a password reset link.
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="your@email.com"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
          <Text style={styles.resetButtonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.05,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: height * 0.1,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: height * 0.01,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: height * 0.04,
  },
  label: {
    fontSize: width * 0.035,
    color: Colors.textLight,
    marginBottom: 5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  inputWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: height * 0.06,
    borderWidth: 1,
    borderColor: Colors.textLight + "40",
    marginBottom: height * 0.025,
  },
  input: {
    fontSize: width * 0.04,
    color: Colors.textDark,
    flex: 1,
  },
  resetButton: {
    width: "60%",
    height: height * 0.06,
    borderRadius: 25,
    backgroundColor: Colors.primaryPurple,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: height * 0.02,
  },
  resetButtonText: {
    color: Colors.white,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  backText: {
    color: Colors.primaryPurple,
    fontSize: width * 0.04,
    textAlign: "center",
    marginTop: 10,
  },
});
