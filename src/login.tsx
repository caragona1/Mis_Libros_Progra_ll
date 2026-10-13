import { useState } from 'react';
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const autenticar = async () => {
    if (!email.trim() || !password) {
      setMensaje('Escribe tu correo y contraseña.');
      return;
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setCargando(true);
      setMensaje('');

      if (registrando) {
        const data = await authService.registrar(email.trim(), password);

        if (data.session) {
          setMensaje('¡Cuenta creada! Entrando a Mis Libros...');
        } else {
          setMensaje(
            'Registro enviado. Revisa tu correo para confirmar la cuenta.'
          );
        }
      } else {
        await authService.iniciarSesion(email.trim(), password);
        setMensaje('¡Inicio de sesión correcto!');
      }
    } catch (error) {
      const detalle =
        error instanceof Error ? error.message : String(error);

      setMensaje('No se pudo completar la operación: ' + detalle);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {registrando ? 'Crear cuenta' : 'Iniciar sesión'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={
          cargando
            ? 'Procesando...'
            : registrando
              ? 'Registrarme'
              : 'Entrar'
        }
        onPress={autenticar}
        disabled={cargando}
      />

      {mensaje !== '' && (
        <Text style={styles.mensaje}>{mensaje}</Text>
      )}

      <View style={styles.separacion}>
        <Button
          title={registrando ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
          onPress={() => {
            setRegistrando(!registrando);
            setMensaje('');
          }}
          disabled={cargando}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  mensaje: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 15,
  },
  separacion: {
    marginTop: 12,
  },
});