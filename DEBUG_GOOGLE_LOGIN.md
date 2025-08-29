# 🔍 دليل تشخيص مشكلة تسجيل الدخول بـ Google

## ✅ المشاكل التي تم إصلاحها:

### 1. إضافة iOS Client ID
- تم إضافة `iosClientId` في إعدادات Google OAuth
- القيمة: `612098820148-f7gu5hpkmqv77npnemadrgm0on69djid.apps.googleusercontent.com`

### 2. تحديث Firebase Config
- تم تحسين إعدادات Google Auth Provider
- إضافة scopes مناسبة

### 3. تحسين معالجة الأخطاء
- إضافة المزيد من رسائل التشخيص
- معالجة أفضل لأخطاء FCM
- رسائل خطأ أكثر وضوحاً

## 🧪 خطوات الاختبار:

### 1. تشغيل التطبيق
```bash
npm run dev
# أو
expo start
```

### 2. فحص Console Logs
ابحث عن الرسائل التالية:
- `🔄 Starting Google login process...`
- `✅ ID Token from Google: [token]`
- `✅ Firebase credential created`
- `✅ Logged in Firebase user: [email]`
- `✅ FCM token obtained: Yes/No`
- `🔄 Calling backend API...`
- `✅ Backend login successful`

### 3. فحص الأخطاء المحتملة
إذا ظهرت أخطاء، ابحث عن:
- `❌ Login error: [details]`
- `❌ Backend login failed: [details]`
- `⚠️ FCM token error: [details]`

## 🚨 المشاكل المحتملة المتبقية:

### 1. مشكلة في Backend API
- تأكد من أن `https://api.growupe.com/api` متاح ويعمل
- تحقق من أن endpoint `/auth-google` موجود ويعمل

### 2. مشكلة في Google OAuth
- تأكد من أن Client IDs صحيحة
- تحقق من إعدادات OAuth في Google Cloud Console

### 3. مشكلة في Firebase
- تأكد من أن Firebase project يعمل
- تحقق من إعدادات Authentication

## 🔧 حلول إضافية:

### 1. اختبار Backend API
```bash
curl -X POST https://api.growupe.com/api/auth-google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"test","fcmToken":"test"}'
```

### 2. فحص Google Cloud Console
- انتقل إلى [Google Cloud Console](https://console.cloud.google.com)
- اختر مشروع `growupe-83565`
- تحقق من إعدادات OAuth 2.0

### 3. فحص Firebase Console
- انتقل إلى [Firebase Console](https://console.firebase.google.com)
- اختر مشروع `growupe-83565`
- تحقق من إعدادات Authentication > Sign-in method

## 📱 اختبار على الأجهزة:

### Android
- تأكد من أن `google-services.json` موجود في `android/app/`
- تحقق من أن package name صحيح: `com.ibrahim.grow`

### iOS
- تأكد من أن `GoogleService-Info.plist` موجود
- تحقق من إعدادات Bundle ID

## 🆘 إذا استمرت المشكلة:

1. شارك رسائل Console Logs
2. شارك رسائل الخطأ
3. تأكد من أن جميع التبعيات مثبتة
4. جرب حذف `node_modules` وإعادة التثبيت
