import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import * as Animatable from 'react-native-animatable';
import { FIREBASE_AUTH, FIREBASE_DB } from "../../config/firebaseConfig";

export default function Signup() {
  const ButtonAnimated = Animatable.createAnimatableComponent(TouchableOpacity)
  const buttonRef = useRef(null)
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");

  const handleForm = async () => {
    try {
      if (
        name === "" ||
        email === "" ||
        password === "" ||
        contact === ""
      ) {
        buttonRef.current.shake()
        alert("Preencha todos os campos");
        Keyboard.dismiss();
        return;
      }
      const user = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      await addDoc(collection(FIREBASE_DB, "users"), {
        userId: user.user.uid,
        name,
        contact,
      });

      alert("Cadastrado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setContact("");
      navigation.navigate("Login");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        alert("email invalido");
      }
      if (err.code === "auth/missing-password") {
        alert("senha invalida");
      }
      if (err.code === "auth/weak-password") {
        alert("A senha deve ter pelo menos 6 caracteres");
      }
      if (err.code === "auth/email-already-in-use") {
        alert("email já esta em uso");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Cadastro</Text>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="contact"
          value={contact}
          onChangeText={(text) => setContact(text)}
        />
      </View>
      <View style={styles.btnArea}>
        <ButtonAnimated style={styles.btnEnviar} onPress={handleForm} ref={buttonRef}>
          <Text style={styles.btn}>Enviar</Text>
        </ButtonAnimated>
        <TouchableOpacity
          style={styles.btnEnviar}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[styles.btn, { backgroundColor: "#e0e1e4" }]}>
            Voltar
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
  textInput: {
    padding: 5,
    borderWidth: 2,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  btnArea: {
    flexDirection: "row",
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  btnEnviar: {
    width: "60%",
    borderRadius: 5,
    padding: 3,
    justifyContent: "space-between",
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
