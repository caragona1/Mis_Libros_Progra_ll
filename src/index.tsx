import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Libro } from '../models/Libro';
import { LibroRepository } from '../repositories/LibroRepository';
import { AuthService } from '../services/AuthService';
import { LibroService } from '../services/LibroService';

export default function Index() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anio, setAnio] = useState('');
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cerrando, setCerrando] = useState(false);

  const [service] = useState(() => new LibroService());
  const [authService] = useState(() => new AuthService());

  useEffect(() => {
    const repo1 = LibroRepository.getInstance();
    const repo2 = LibroRepository.getInstance();

    console.log('¿Es la misma instancia?', repo1 === repo2);

    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      setCargando(true);
      const datos = await service.obtenerLibros();
      setLibros(datos);
    } catch (error) {
      console.error('Error al cargar libros:', error);
      Alert.alert('Error', 'No se pudieron cargar los libros.');
    } finally {
      setCargando(false);
    }
  };

  const agregarLibro = async () => {
    if (!titulo.trim() || !autor.trim() || !anio.trim()) {
      Alert.alert('Faltan datos', 'Completa todos los campos.');
      return;
    }

    const anioNumero = Number(anio);

    if (!Number.isInteger(anioNumero) || anioNumero <= 0) {
      Alert.alert('Año inválido', 'Escribe un año válido.');
      return;
    }

    try {
      setGuardando(true);

      await service.agregarLibro(
        titulo.trim(),
        autor.trim(),
        anioNumero
      );

      setTitulo('');
      setAutor('');
      setAnio('');

      await cargarLibros();
      Alert.alert('Éxito', 'Libro agregado correctamente.');
    } catch (error) {
      console.error('Error al agregar libro:', error);
      Alert.alert('Error', 'No se pudo agregar el libro.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarLibro = async (id: number) => {
    try {
      await service.eliminarLibro(id);
      await cargarLibros();
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      Alert.alert('Error', 'No se pudo eliminar el libro.');
    }
  };

  const cerrarSesion = async () => {
    try {
      setCerrando(true);
      await authService.cerrarSesion();
      router.replace('/login');
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'Ocurrió un error.';
      Alert.alert('Error', 'No se pudo cerrar sesión: ' + mensaje);
    } finally {
      setCerrando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Libros</Text>

      <View style={styles.botonCerrar}>
        <Button
          title={cerrando ? 'Cerrando sesión...' : 'Cerrar sesión'}
          onPress={cerrarSesion}
          disabled={cerrando}
        />
      </View>

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
        title={guardando ? 'Guardando...' : 'Agregar libro'}
        onPress={agregarLibro}
        disabled={guardando}
      />

      {cargando ? (
        <ActivityIndicator size="large" style={styles.cargando} />
      ) : (
        <FlatList
          data={libros}
          keyExtractor={(item) => item.getId().toString()}
          ListEmptyComponent={
            <Text style={styles.vacio}>Todavía no hay libros.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.libro}>
              <Text style={styles.texto}>{item.getTitulo()}</Text>
              <Text>Autor: {item.getAutor()}</Text>
              <Text>Año: {item.getAnio()}</Text>
              <Button
                title="Eliminar"
                onPress={() => eliminarLibro(item.getId())}
              />
            </View>
          )}
        />
      )}
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  botonCerrar: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  libro: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    marginTop: 15,
  },
  texto: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cargando: {
    marginTop: 20,
  },
  vacio: {
    marginTop: 20,
    textAlign: 'center',
  },
});