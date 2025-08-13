import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useFonts, Tajawal_500Medium } from '@expo-google-fonts/tajawal';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showSubtitle?: boolean;
}

export default function Logo({ size = 'medium', showSubtitle = false }: LogoProps) {
  const [fontsLoaded] = useFonts({ Tajawal_500Medium });
  if (!fontsLoaded) {
    return null;
  }
  const sizePx = size === 'small' ? 48 : size === 'large' ? 96 : 72;
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: 130, height: 130, resizeMode: 'contain' }}
      />
      {showSubtitle && (
        <Text style={[styles.subtitle, { fontFamily: 'Tajawal_500Medium' }]}>رفيقك الرقمي للنمو والتطور</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },
});