import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';

export default function PrivacySecurityScreen() {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#095028" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>سياسة الخصوصية</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>آخر تحديث</Text>
          <Text style={styles.paragraph}>6 مايو 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مقدمة</Text>
          <Text style={styles.paragraph}>
            نحن في تطبيق GrowUp نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية.
            تصف سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات التي تقدمها عند استخدام تطبيقنا.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المعلومات التي نجمعها</Text>
          <Text style={styles.paragraph}>
            - المعلومات الشخصية (مثل الاسم والبريد الإلكتروني) التي تقدمها عند إنشاء الحساب{'\n'}
            - المعلومات المالية التي تدخلها في التطبيق لأغراض التخطيط والتتبع{'\n'}
            - معلومات عن عاداتك وأهدافك الشخصية التي تضيفها للتطبيق{'\n'}
            - معلومات تقنية عن جهازك وكيفية استخدامك للتطبيق
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>كيفية استخدام المعلومات</Text>
          <Text style={styles.paragraph}>
            - توفير وتحسين خدمات التطبيق{'\n'}
            - إنشاء تقارير وتحليلات مخصصة لك{'\n'}
            - إرسال تنبيهات وإشعارات متعلقة بأهدافك والتزاماتك{'\n'}
            - تحسين وتطوير ميزات جديدة للتطبيق
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مشاركة المعلومات</Text>
          <Text style={styles.paragraph}>
            نحن لا نبيع أو نؤجر أو نتاجر بمعلوماتك الشخصية مع أطراف ثالثة. 
            قد نشارك معلوماتك فقط في الحالات التالية:{'\n'}
            - مع مقدمي الخدمات الذين يساعدوننا في تشغيل التطبيق (مثل خدمات الاستضافة ومعالجة المدفوعات){'\n'}
            - عندما يكون ذلك مطلوبًا بموجب القانون أو لحماية حقوقنا{'\n'}
            - في حالة الاندماج أو الاستحواذ، قد يتم نقل معلوماتك إلى الشركة الجديدة
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أمان البيانات</Text>
          <Text style={styles.paragraph}>
            نحن نتخذ تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف.
            نستخدم تقنيات التشفير وجدران الحماية وغيرها من الإجراءات الأمنية لحماية بياناتك.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حقوقك</Text>
          <Text style={styles.paragraph}>
            - الوصول إلى بياناتك الشخصية{'\n'}
            - تصحيح البيانات غير الدقيقة{'\n'}
            - حذف بياناتك (في ظروف معينة){'\n'}
            - تقييد معالجة بياناتك{'\n'}
            - نقل بياناتك (في ظروف معينة){'\n'}
            - الاعتراض على المعالجة
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التغييرات على سياسة الخصوصية</Text>
          <Text style={styles.paragraph}>
            قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر.
            سنخطرك بأي تغييرات جوهرية من خلال نشر السياسة الجديدة على التطبيق وإخطارك عبر البريد الإلكتروني.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اتصل بنا</Text>
          <Text style={styles.paragraph}>
            إذا كانت لديك أسئلة أو استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني:{'\n'}
            privacy@growup-app.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            تطبيق GrowUp - سياسة الخصوصية
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
    marginBottom: 12,
    textAlign: 'right',
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    lineHeight: 22,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
