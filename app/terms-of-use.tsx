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
import { ChevronRight,ChevronLeft } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';

export default function TermsOfUseScreen() {
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
        <Text style={styles.headerTitle}>شروط الاستخدام</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>آخر تحديث: 6 مايو 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مقدمة</Text>
          <Text style={styles.paragraph}>
            مرحبًا بك في تطبيق GrowUp. باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بهذه الشروط والأحكام. يُرجى قراءتها بعناية قبل استخدام التطبيق.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>استخدام التطبيق</Text>
          <Text style={styles.paragraph}>
            عند استخدام تطبيق GrowUp، أنت توافق على:{'\n'}
            • توفير معلومات دقيقة وكاملة عند إنشاء حسابك{'\n'}
            • الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك{'\n'}
            • استخدام التطبيق بطريقة قانونية وأخلاقية{'\n'}
            • عدم استخدام التطبيق لأي غرض غير مصرح به أو غير قانوني
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الحسابات والتسجيل</Text>
          <Text style={styles.paragraph}>
            لاستخدام بعض ميزات التطبيق، قد تحتاج إلى إنشاء حساب. أنت مسؤول عن الحفاظ على أمان حسابك وكلمة المرور الخاصة بك. يجب إخطارنا فورًا بأي استخدام غير مصرح به لحسابك.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الاشتراكات والمدفوعات</Text>
          <Text style={styles.paragraph}>
            يقدم التطبيق خطط اشتراك مدفوعة للوصول إلى ميزات متقدمة:{'\n'}
            • تتم معالجة المدفوعات من خلال مزودي خدمة دفع خارجيين{'\n'}
            • يتم تجديد الاشتراكات تلقائيًا ما لم يتم إلغاؤها قبل تاريخ التجديد{'\n'}
            • يمكن إلغاء الاشتراك في أي وقت من خلال إعدادات حسابك
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حقوق الملكية الفكرية</Text>
          <Text style={styles.paragraph}>
            التطبيق وجميع محتوياته، بما في ذلك النصوص والصور والرسومات والواجهة والشعارات، هي مملوكة لنا أو مرخصة لنا. لا يُسمح بنسخ أو إعادة إنتاج أو تعديل أو توزيع أي جزء من التطبيق دون إذن كتابي منا.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إخلاء المسؤولية</Text>
          <Text style={styles.paragraph}>
            يتم توفير التطبيق "كما هو" دون أي ضمانات. نحن لا نضمن أن التطبيق سيكون خاليًا من الأخطاء أو متاحًا بشكل مستمر. النصائح والمعلومات المقدمة في التطبيق هي لأغراض إرشادية عامة فقط ولا ينبغي اعتبارها نصائح مالية أو قانونية محترفة.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تحديد المسؤولية</Text>
          <Text style={styles.paragraph}>
            لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية تنشأ عن استخدامك للتطبيق، بما في ذلك على سبيل المثال لا الحصر، فقدان البيانات أو الأرباح.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التعديلات على الشروط</Text>
          <Text style={styles.paragraph}>
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر الشروط المعدلة على التطبيق. استمرارك في استخدام التطبيق بعد نشر أي تغييرات يعني موافقتك على الشروط المعدلة.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>القانون الحاكم</Text>
          <Text style={styles.paragraph}>
            تخضع هذه الشروط للقوانين المعمول بها، وأي نزاع ينشأ عن استخدام التطبيق سيخضع للاختصاص الحصري للمحاكم المختصة.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اتصل بنا</Text>
          <Text style={styles.paragraph}>
            إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا على:{'\n'}
            terms@growup-app.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            تطبيق GrowUp - شروط الاستخدام
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
