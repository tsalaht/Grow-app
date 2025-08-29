# 🔧 دليل إعداد Google OAuth لحل مشكلة "invalid_request: 400"

## 🚨 المشكلة:
التطبيق لا يتوافق مع سياسة Google OAuth 2.0 للحفاظ على أمان التطبيقات.

## ✅ الحلول المطلوبة:

### 1. فحص Google Cloud Console

#### أ) انتقل إلى Google Cloud Console
- اذهب إلى: https://console.cloud.google.com
- اختر مشروع: `growupe-83565`

#### ب) تفعيل Google+ API
- اذهب إلى: APIs & Services > Library
- ابحث عن: "Google+ API" أو "Google Identity"
- تأكد من تفعيلها

#### ج) فحص إعدادات OAuth 2.0
- اذهب إلى: APIs & Services > Credentials
- تأكد من وجود OAuth 2.0 Client IDs صحيحة

### 2. تحديث OAuth Consent Screen

#### أ) إعدادات OAuth Consent Screen
- اذهب إلى: APIs & Services > OAuth consent screen
- تأكد من إكمال جميع الحقول المطلوبة:
  - App name: `GrowUp`
  - User support email
  - Developer contact information
  - Authorized domains

#### ب) إضافة Scopes المطلوبة
- `openid`
- `profile` 
- `email`

### 3. تحديث Client IDs

#### أ) Web Client ID
```
612098820148-p8vr2kcg1ir3idtfols8u1o5lcrlut5j.apps.googleusercontent.com
```

#### ب) Android Client ID
```
612098820148-dvpi00tc6m9fcotm58hbd6hf41fo3n73.apps.googleusercontent.com
```

#### ج) iOS Client ID
```
612098820148-f7gu5hpkmqv77npnemadrgm0on69djid.apps.googleusercontent.com
```

### 4. فحص Firebase Console

#### أ) انتقل إلى Firebase Console
- اذهب إلى: https://console.firebase.google.com
- اختر مشروع: `growupe-83565`

#### ب) تفعيل Google Sign-In
- اذهب إلى: Authentication > Sign-in method
- تأكد من تفعيل Google كطريقة تسجيل دخول

#### ج) إضافة SHA-1 fingerprints
- اذهب إلى: Project Settings > General
- أضف SHA-1 fingerprints للأجهزة

### 5. تحديث إعدادات التطبيق

#### أ) تحديث app.json
```json
{
  "expo": {
    "android": {
      "package": "com.ibrahim.grow",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.ibrahim.grow",
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

#### ب) تحديث google-services.json
- تأكد من أن package name صحيح: `com.ibrahim.grow`
- تأكد من أن SHA-1 fingerprints صحيحة

## 🧪 خطوات الاختبار:

### 1. بعد التحديثات
```bash
# إعادة بناء التطبيق
expo prebuild --clean
expo run:android
# أو
expo run:ios
```

### 2. فحص Console Logs
ابحث عن:
- `✅ ID Token from Google: [token]`
- `✅ Firebase credential created`
- `✅ Logged in Firebase user: [email]`

## 🆘 إذا استمرت المشكلة:

1. **تحقق من Google Cloud Console** - تأكد من تفعيل جميع APIs المطلوبة
2. **تحقق من Firebase Console** - تأكد من إعدادات Authentication
3. **تحقق من OAuth Consent Screen** - تأكد من إكمال جميع الحقول
4. **تحقق من Client IDs** - تأكد من صحة جميع Client IDs

## 📞 دعم Google:

إذا استمرت المشكلة، يمكنك:
- مراجعة [Google OAuth 2.0 Policy](https://developers.google.com/identity/protocols/oauth2)
- التواصل مع [Google Cloud Support](https://cloud.google.com/support)
