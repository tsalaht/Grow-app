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

export default function RefundPolicyScreen() {
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
        <Text style={styles.headerTitle}>سياسة استرداد الأموال</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>آخر تحديث</Text>
          <Text style={styles.paragraph}>6 مايو 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مقدمة</Text>
          <Text style={styles.paragraph}>
            في تطبيق GrowUp، نسعى دائمًا لضمان رضا المستخدمين عن خدماتنا. تصف هذه السياسة إجراءات استرداد الأموال الخاصة بنا للاشتراكات المدفوعة.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>فترة ضمان استرداد الأموال</Text>
          <Text style={styles.paragraph}>
            نقدم ضمان استرداد كامل المبلغ خلال 14 يومًا من تاريخ الاشتراك الأولي. إذا لم تكن راضيًا عن خدماتنا لأي سبب خلال هذه الفترة، يمكنك طلب استرداد كامل المبلغ دون الحاجة إلى تقديم تفسير.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>كيفية طلب استرداد الأموال</Text>
          <Text style={styles.paragraph}>
            - إرسال طلب عبر قسم "الدعم" في التطبيق{'\n'}
            - إرسال بريد إلكتروني إلى refunds@growup-app.com{'\n'}
            - الاتصال بخدمة العملاء على الرقم المذكور في التطبيق{'\n\n'}
            يرجى تضمين تفاصيل حسابك وتاريخ الاشتراك في طلبك.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معالجة طلبات الاسترداد</Text>
          <Text style={styles.paragraph}>
            سنقوم بمراجعة طلب الاسترداد الخاص بك في غضون 2-3 أيام عمل. بمجرد الموافقة، سيتم رد المبلغ إلى طريقة الدفع الأصلية التي استخدمتها للاشتراك. قد يستغرق ظهور المبلغ في حسابك ما بين 5-10 أيام عمل حسب سياسات البنك أو مزود خدمة الدفع الخاص بك.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>استثناءات</Text>
          <Text style={styles.paragraph}>
            قد لا تكون بعض الحالات مؤهلة للاسترداد الكامل بعد فترة الضمان البالغة 14 يومًا:{'\n'}
            • الاشتراكات التي مضى عليها أكثر من 14 يومًا{'\n'}
            • الاشتراكات التي استفادت من خصومات خاصة أو عروض ترويجية{'\n'}
            • الحسابات التي أساءت استخدام سياسة الاسترداد سابقًا{'\n\n'}
            ومع ذلك، سننظر في كل حالة على حدة، وقد نقدم استردادًا جزئيًا أو كاملًا بناءً على الظروف.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إلغاء الاشتراك</Text>
          <Text style={styles.paragraph}>
            يمكنك إلغاء اشتراكك في أي وقت من خلال إعدادات حسابك في التطبيق. عند إلغاء الاشتراك، ستستمر في الوصول إلى الميزات المدفوعة حتى نهاية فترة الفوترة الحالية. لن يتم تحصيل أي رسوم إضافية بعد ذلك.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تغييرات على سياسة الاسترداد</Text>
          <Text style={styles.paragraph}>
            نحتفظ بالحق في تعديل سياسة الاسترداد هذه في أي وقت. ستكون التغييرات سارية المفعول فور نشرها على التطبيق. لن تؤثر أي تغييرات على طلبات الاسترداد المقدمة قبل تاريخ التغيير.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اتصل بنا</Text>
          <Text style={styles.paragraph}>
            refunds@growup-app.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            تطبيق GrowUp - سياسة استرداد الأموال
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
