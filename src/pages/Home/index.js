import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation, StackActions } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { FIREBASE_DB, FIREBASE_AUTH } from "../../config/firebaseConfig";
import Details from "../Details";

export default function Home({ route }) {
  const ButtonAnimated = Animatable.createAnimatableComponent(TouchableOpacity)
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const create = async () => {
    if (title === "" || inputValue === "") {
      setDisabled(true)
      buttonRef.current.shake()
      return;
    }

    addDoc(collection(FIREBASE_DB, "documents"), {
      userId: route.params.userId,
      title,
      inputValue,
    });
    setTitle("");
    setInputValue("");

    Keyboard.dismiss(); // fechar teclado
  };

  const remove = async (data) => {
    const ref = doc(FIREBASE_DB, `documents/${data.id}`);
    if (ref.id === data.id) {
      deleteDoc(ref);
    }
  };

  // preencher os inputs com os dados..
  const update = async (data) => {
    setTitle(data.title);
    setInputValue(data.inputValue);
    setUpdatedData(data);
  };

  const isUpdated = async () => {
    if (updatedData) {
      const ref = doc(FIREBASE_DB, `documents/${updatedData.id}`);

      if (ref.id === updatedData.id) {
        await updateDoc(ref, {
          title,
          inputValue,
        });
      }
      setTitle("");
      setInputValue("");
      Keyboard.dismiss();
    }
  };

  const logout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      alert("deslogado com sucesso!");
      navigation.dispatch(StackActions.popToTop()); // zera a pilha de navegação
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const data = collection(FIREBASE_DB, "documents");
    if (data.userId === route.params.uid) {
      const isDocs = onSnapshot(data, {
        next: (snapshot) => {
          const values = [];
          snapshot.docs.forEach((value) => {
            values.push({
              id: value.id,
              ...value.data(),
            });
          });
          setData(values);
          setLoading(false);
        },
      });
      return () => isDocs();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoutArea}>
        <TouchableOpacity style={styles.btnLogout} onPress={logout}>
          <AntDesign name="logout" size={20} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.textArea}>
        <Text style={styles.text}>Lista de Tarefas</Text>
      </View>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="titulo"
          value={title}
          onChangeText={(text) => setTitle(text)}
          ref={inputRef}
        />
        <TextInput
          style={styles.inputValue}
          multiline
          numberOfLines={4}
          placeholder="digite uma tarefa"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />
      </View>

      <View style={styles.btnArea}>
        <ButtonAnimated style={styles.btn} onPress={create} ref={buttonRef}>
          <Entypo name="add-to-list" size={30} color="#f1e061" disabled={disabled}/>
        </ButtonAnimated>
        <TouchableOpacity style={styles.btn} onPress={isUpdated}>
          <AntDesign name="sync" size={30} color="#158c15" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#121212" size={45} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => (
            <Details data={item} remove={remove} update={update} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logoutArea: {},
  logoutArea: {
    marginTop: 10,
    marginLeft: "85%",
    height: "3%",
  },
  textArea: {
    margin: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputArea: {
    width: "80%",
    height: 400,
  },
  input: {
    padding: 5,
    borderWidth: 2,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  inputValue: {
    height: 150,
    padding: 5,
    borderWidth: 2,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
  },
  btnArea: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: -190,
    justifyContent: "space-around",
    borderBottomWidth: 10,
    borderColor: "#e7e7e9",
  },
  btn: {
    padding: 20,
  },
});
