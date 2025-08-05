import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  PixelRatio,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../../firebase/config";
import { useRouter } from "expo-router";
import { useContext } from "react";


import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 600;

const normalize = (size) => {
  const scale = width / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
 

  const handleSignUp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!trimmedEmail || !trimmedPassword) {
      return Alert.alert(
        "Missing Fields",
        "Please enter both email and password."
      );
    }

    if (!emailRegex.test(trimmedEmail)) {
      return Alert.alert(
        "Invalid Email Format",
        "Please enter a valid Gmail address (e.g., example@gmail.com)."
      );
    }

    if (!passwordRegex.test(trimmedPassword)) {
      return Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long and include letters, numbers, and at least one special character."
      );
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      const user = userCredential.user;

      await sendEmailVerification(user);

      Alert.alert(
        "Verify Your Email",
        "A verification link has been sent to your email. Please verify before logging in."
      );
    } catch (error) {
      let message = error.message;

      if (error.code === "auth/email-already-in-use") {
        message = "This Gmail is already in use. Try logging in.";
      } else if (error.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }

      Alert.alert("Signup Error", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainIconContainer}>
          <Image
            source={require("../../../assets/images/img.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Let's get started!</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={Colors.textLight}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.inputRightIcon}
            >
              <FontAwesome
                name={showPassword ? "eye-slash" : "eye"}
                size={normalize(18)}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={async () => {
              await auth.currentUser?.reload();
              if (auth.currentUser?.emailVerified) {
                await AsyncStorage.setItem(
                  "user",
                  JSON.stringify(auth.currentUser)
                );
               
                router.replace("/screens/home/AllTaskScreen");
              } else {
                Alert.alert(
                  "Email not verified",
                  "Please verify your email before continuing."
                );
              }
            }}
          >
            <Text style={styles.signUpButtonText}>
              I have verified my email
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or sign up with</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButtonfacebook}
              onPress={() => console.log("Facebook Sign Up")}
            >
              <FontAwesome
                name="facebook"
                size={normalize(22)}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButtongoogle}
              onPress={() => console.log("Google Sign Up")}
            >
              <FontAwesome
                name="google"
                size={normalize(22)}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButtonapple}
              onPress={() => console.log("Apple Sign Up")}
            >
              <FontAwesome
                name="apple"
                size={normalize(22)}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.bottomLinkContainer}
          >
            <Text style={styles.bottomLinkText}>
              Already have an account? <Text style={styles.link}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.02,
    justifyContent: "space-between",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: height * 0.05,
  },
  mainIconContainer: {
    alignItems: "center",
  },
  image: {
    height: isTablet ? height * 0.25 : height * 0.15,
    width: isTablet ? height * 0.25 : height * 0.15,
  },
  title: {
    fontSize: normalize(26),
    fontWeight: "bold",
    color: Colors.textDark,
    textAlign: "center",
    marginVertical: height * 0.02,
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: normalize(13),
    color: Colors.textLight,
    marginBottom: 5,
    textTransform: "uppercase",
    fontWeight: "600",
    marginTop: height * 0.02,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 10,
    height: height * 0.06,
    borderWidth: 1,
    borderColor: Colors.textLight + "40",
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    color: Colors.textDark,
    paddingRight: 10,
  },
  inputRightIcon: {
    marginLeft: 10,
  },
  signUpButton: {
    width: "60%",
    height: height * 0.06,
    borderRadius: 30,
    backgroundColor: Colors.primaryPurple,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: height * 0.03,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signUpButtonText: {
    color: Colors.white,
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  orText: {
    fontSize: normalize(13),
    color: Colors.textLight,
    textAlign: "center",
    marginVertical: height * 0.03,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.015,
  },
  socialButtonfacebook: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: Colors.facebook,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  socialButtongoogle: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: Colors.google,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  socialButtonapple: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  bottomLinkContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: height * 0.015,
    paddingBottom: height * 0.03,
    width: "100%",
  },
  bottomLinkText: {
    fontSize: width >= 600 ? width * 0.035 : width * 0.035,
    color: Colors.textLight,
    textAlign: "center",
    flexWrap: "wrap",
    flexShrink: 1,
    width: "90%",
  },
  link: {
    color: Colors.primaryPurple,
    fontWeight: "bold",
    fontSize: width >= 600 ? width * 0.045 : width * 0.035,
  },
});
