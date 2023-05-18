import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as Animatable from 'react-native-animatable';
import { FIREBASE_AUTH } from "../../config/firebaseConfig";

export default function Login() {
  const ButtonAnimated = Animatable.createAnimatableComponent(TouchableOpacity)
  const buttonRef = useRef(null)
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      /* alert("Bem Vindo(a): " + result.user.email) */
      setEmail("");
      setPassword("");  
      navigation.navigate("Home", {userId: result.user.uid});
    } catch (err) {
      if(err.code === "auth/invalid-email") {
        buttonRef.current.shake()
        Keyboard.dismiss();
        alert("Email invalido!")
      }
      if(err.code === "auth/missing-password") {
        buttonRef.current.shake()
        Keyboard.dismiss();
        alert("Informe a senha!")
      }
      if(err.code === "auth/wrong-password") {
        buttonRef.current.shake()
        Keyboard.dismiss();
        alert("Senha invalida!")
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Login</Text>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.btnArea}>
        <ButtonAnimated
        style={{ width: "40%" }}
        ref={buttonRef}
        onPress={handleLogin}>
          <Text
          style={styles.btn}
          >Entrar</Text>
        </ButtonAnimated>
        <TouchableOpacity
          style={{ width: "50%" }}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={[styles.btn, { backgroundColor: "#e0e1e4" }]}>
            Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputArea: {
    width: 300,
  },
  input: {
    padding: 5,
    borderWidth: 2,
    margin: 5,
    borderRadius: 5,
  },
  btnArea: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "space-evenly",
  },
  btn: {
    padding: 3,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#bfcde7",
    borderRadius: 5,
    borderWidth: 2,
  },
});
