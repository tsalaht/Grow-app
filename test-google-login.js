// test-google-login.js
// ملف اختبار لتشخيص مشكلة Google Login

console.log('🔍 تشخيص مشكلة Google Login');

// 1. فحص Client IDs
const clientIds = {
  web: '612098820148-p8vr2kcg1ir3idtfols8u1o5lcrlut5j.apps.googleusercontent.com',
  android: '612098820148-dvpi00tc6m9fcotm58hbd6hf41fo3n73.apps.googleusercontent.com',
  ios: '612098820148-f7gu5hpkmqv77npnemadrgm0on69djid.apps.googleusercontent.com'
};

console.log('📱 Client IDs:', clientIds);

// 2. فحص Firebase Config
const firebaseConfig = {
  apiKey: 'AIzaSyD_kiYRu7LtfQyCAPQmJ0hyv-EdI3YwAkc',
  authDomain: 'growupe-83565.firebaseapp.com',
  projectId: 'growupe-83565',
  storageBucket: 'growupe-83565.firebasestorage.app',
  messagingSenderId: '612098820148',
  appId: '1:612098820148:android:0dd962ab8da084499c6261'
};

console.log('🔥 Firebase Config:', firebaseConfig);

// 3. خطوات التشخيص
console.log(`
🔧 خطوات التشخيص:

1. تأكد من أن Google OAuth مفعل في Google Cloud Console
2. تأكد من إكمال OAuth Consent Screen
3. تأكد من صحة Client IDs
4. تأكد من تفعيل Google+ API
5. تأكد من أن Firebase project يعمل
6. تأكد من إعدادات Authentication في Firebase

📱 للتطبيق:
1. أعد بناء التطبيق: expo prebuild --clean
2. شغل التطبيق: expo run:android
3. راقب Console Logs
4. ابحث عن رسائل الخطأ

🚨 المشاكل المحتملة:
- Client IDs غير صحيحة
- OAuth Consent Screen غير مكتمل
- APIs غير مفعلة
- Firebase config غير صحيح
`);

export { clientIds, firebaseConfig };
