import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sprout } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showSubtitle?: boolean;
}

export default function Logo({ size = 'medium', color = '#12A150', showSubtitle = false }: LogoProps) {
  const logoSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium';
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoWrapper}>
        <View style={[styles.iconBackground, { backgroundColor: `${color}15` }]}>
          <Sprout size={logoSize === 'small' ? 20 : logoSize === 'large' ? 40 : 28} color={color} strokeWidth={2.5} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.logoText, styles[`${logoSize}Text`], { color, fontFamily: 'Tajawal_700Bold' }]}>
            Grow<Text style={[styles.logoAccent, { color: '#2d7d32', fontFamily: 'Tajawal_900Black' }]}>Up</Text>
          </Text>
          <View style={[styles.underline, { backgroundColor: color }]} />
        </View>
      </View>
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
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBackground: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#12A150',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  textContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontWeight: '800',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(18, 161, 80, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoAccent: {
    fontWeight: '900',
  },
  smallText: {
    fontSize: 20,
  },
  mediumText: {
    fontSize: 28,
  },
  largeText: {
    fontSize: 36,
  },
  underline: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginTop: 4,
    opacity: 0.8,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },
});