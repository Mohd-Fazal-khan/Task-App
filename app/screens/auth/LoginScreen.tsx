import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";


const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();  

  

const handleLogin = async () => {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return Alert.alert("Missing Fields", "Please enter both email and password.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      trimmedEmail,
      trimmedPassword
    );

    const user = userCredential.user;

    // ✅ Check if email is verified
    if (!user.emailVerified) {
      Alert.alert(
        "Email Not Verified",
        "Please verify your email address before logging in. Check your inbox or spam folder."
      );
      return; 
    }

    
    await AsyncStorage.setItem("user", JSON.stringify(user));


    router.replace("/screens/home/AllTaskScreen");

  } catch (error) {
    let message = error.message;

    if (error.code === "auth/user-not-found") {
      message = "No user found with this email.";
    } else if (error.code === "auth/wrong-password") {
      message = "Incorrect password. Please try again.";
    }

    Alert.alert("Login Error", message);
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

        <Text style={styles.title}>Welcome back!</Text>

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

          <View style={styles.passwordInputContainer}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity
              onPress={()=>{router.push('/screens/auth/ForgotPasswordScreen')}}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
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
                <MaterialCommunityIcons
                  name={showPassword ? "eye" : "eye-off"}
                  size={width * 0.05}
                  color={Colors.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or log in with</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButtonfacebook}
              onPress={() => console.log("Facebook Login")}
            >
              <FontAwesome
                name="facebook"
                size={width * 0.06}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButtongoogle}
              onPress={() => console.log("Google Login")}
            >
              <FontAwesome
                name="google"
                size={width * 0.06}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButtonapple}
              onPress={() => console.log("Apple Login")}
            >
              <FontAwesome
                name="apple"
                size={width * 0.06}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
          style={styles.bottomLinkContainer}
        >
          <Text style={styles.bottomLinkText}>
            Don't have an account? <Text style={styles.link}>Get started!</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    paddingBottom: height * 0.04,
  },
  mainIconContainer: {
    alignItems: "center",
  },
  image: {
    height: height * 0.15,
    width: height * 0.15,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: "bold",
    color: Colors.textDark,
    textAlign: "center",
    marginVertical: height * 0.015,
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: width * 0.035,
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
    height: height * 0.06,
    borderWidth: 1,
    borderColor: Colors.textLight + "40",
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: Colors.textLight,
  },
  inputRightIcon: {
    marginLeft: 10,
  },
  passwordInputContainer: {
    marginBottom: height * 0.01,
  },
  forgotPassword: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  forgotPasswordText: {
    fontSize: width * 0.035,
    color: Colors.primaryPurple,
    fontWeight: "600",
  },
  loginButton: {
    width: "60%",
    height: height * 0.06,
    borderRadius: 25,
    backgroundColor: Colors.primaryPurple,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: height * 0.025,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  orText: {
    fontSize: width * 0.035,
    color: Colors.textLight,
    textAlign: "center",
    marginVertical: height * 0.02,
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
