import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  I18nManager,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Globe, Download, Share2,ChevronLeft } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import { useMyAppContext } from '@/context/MyAppContext';


interface ProfileOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const { username, setUsername, resetAppState } = useMyAppContext();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [userEmail] = useState('ibrahim@example.com');

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج من التطبيق؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: () => {
            // هنا يتم تسجيل الخروج والعودة لشاشة تسجيل الدخول
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleResetAppState = () => {
    Alert.alert(
      'إعادة تعيين الإعدادات',
      'هل تريد إعادة تعيين إعدادات التطبيق والعودة لشاشة الترحيب؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'إعادة تعيين',
          style: 'destructive',
          onPress: async () => {
            await resetAppState();
            router.replace('/onboarding' as any);
          },
        },
      ]
    );
  };

  const profileOptions: ProfileOption[] = [
    {
      id: 'account',
      title: 'إعدادات الحساب',
      subtitle: 'تحديث المعلومات الشخصية',
      icon: <User size={20} color="#095028" />,
      action: () => Alert.alert('إعدادات الحساب', 'قريباً - إعدادات الحساب'),
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      subtitle: 'إدارة إشعارات التطبيق',
      icon: <Bell size={20} color="#095028" />,
      action: () => {},
      hasSwitch: true,
      switchValue: notifications,
      onSwitchChange: setNotifications,
    },

   
    {
      id: 'privacy',
      title: 'الخصوصية والأمان',
      subtitle: 'إعدادات الحماية',
      icon: <Shield size={20} color="#095028" />,
      action: () => router.push('/privacy-security'),
    },
    {
      id: 'terms',
      title: 'شروط الاستخدام',
      subtitle: 'الشروط والأحكام',
      icon: <Shield size={20} color="#095028" />,
      action: () => router.push('/terms-of-use'),
    },
    {
      id: 'refund',
      title: 'سياسة استرداد الأموال',
      subtitle: 'سياسة الاسترداد',
      icon: <Shield size={20} color="#095028" />,
      action: () => router.push('/refund-policy'),
    },

    {
      id: 'reset',
      title: 'إعادة تعيين الإعدادات',
      subtitle: 'العودة لشاشة الترحيب',
      icon: <Settings size={20} color="#EF4444" />,
      action: handleResetAppState,
    },
  ];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الملف الشخصي</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{username}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
            <View style={styles.membershipBadge}>
              <Text style={styles.membershipText}>عضو منذ يناير 2025</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Settings size={20} color="#095028" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>أهداف محققة</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>معدل الإنجاز</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>يوم نشط</Text>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.action}
              disabled={option.hasSwitch}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  {option.icon}
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
              </View>
              <View style={styles.optionRight}>
                {option.hasSwitch ? (
                  <Switch
                    value={option.switchValue}
                    onValueChange={option.onSwitchChange}
                    trackColor={{ false: '#E5E7EB', true: '#A2E9C1' }}
                    thumbColor={option.switchValue ? '#095028' : '#9CA3AF'}
                  />
                ) : (
                  <ChevronLeft size={16} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>GrowUp الإصدار 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 جميع الحقوق محفوظة</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#A2E9C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'right',
  },
  membershipBadge: {
    backgroundColor: '#A2E9C1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  membershipText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#095028',
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A2E9C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#1F2937',
    marginBottom: 2,
    textAlign: 'right',
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  optionRight: {
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
  },
  copyrightText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#9CA3AF',
  },
});