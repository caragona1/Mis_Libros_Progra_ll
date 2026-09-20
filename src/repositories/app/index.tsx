import { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Libro } from "../src/models/Libro";
import { LibroService } from "../src/services/LibroService";
import { LibroRepository } from "../src/repositories/LibroRepository";

export default function Index() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anio, setAnio] = useState("");

  const [libros, setLibros] = useState<Libro[]>([]);

  const [service] = useState(new LibroService());

  // Comprobación del Singleton
  const repo1 = LibroRepository.getInstance();
  const repo2 = LibroRepository.getInstance();

  console.log("¿Es la misma instancia?", repo1 === repo2);

  const agregarLibro = () => {
    if (titulo === "" || autor === "" || anio === "") {
      return;
    }

    service.agregarLibro(
      titulo,
      autor,
      Number(anio)
    );

    setLibros([...service.obtenerLibros()]);

    setTitulo("");
    setAutor("");
    setAnio("");
  };

  const eliminarLibro = (id: number) => {
    service.eliminarLibro(id);

    setLibros([...service.obtenerLibros()]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Mis Libros
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={autor}
        onChangeText={setAutor}
      />

      <TextInput
        style={styles.input}
        placeholder="Año"
        value={anio}
        onChangeText={setAnio}
        keyboardType="numeric"
      />

      <Button
        title="Agregar libro"
        onPress={agregarLibro}
      />

      <FlatList
        data={libros}
        keyExtractor={(item) => item.getId().toString()}
        renderItem={({ item }) => (
          <View style={styles.libro}>
            <Text style={styles.texto}>
              {item.getTitulo()}
            </Text>

            <Text>
              Autor: {item.getAutor()}
            </Text>

            <Text>
              Año: {item.getAnio()}
            </Text>

            <Button
              title="Eliminar"
              onPress={() => eliminarLibro(item.getId())}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },

  libro: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 15,
    marginTop: 15,
  },

  texto: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
