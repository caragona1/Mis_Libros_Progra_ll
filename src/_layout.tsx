import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [sesionLista, setSesionLista] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    let activo = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!activo) return;

      if (error) {
        console.error('Error al obtener sesión:', error.message);
      }

      setAutenticado(!!data.session);
      setSesionLista(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        setAutenticado(!!session);
        setSesionLista(true);
      }
    );

    return () => {
      activo = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sesionLista) return;

    const primeraRuta = segments[0];
    const estaEnLogin = String(primeraRuta) === 'login';

    if (!autenticado && !estaEnLogin) {
      router.replace('/login' as any);
    } else if (autenticado && estaEnLogin) {
      router.replace('/');
    }
  }, [autenticado, sesionLista, segments, router]);

  if (!sesionLista) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
      </Stack>
    </ThemeProvider>
  );
}