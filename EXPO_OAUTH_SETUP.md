# 🔧 دليل إعداد Expo OAuth لحل مشكلة Google Login

## 🚨 المشكلة:
```
invalid_request: 400
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy
```

## ✅ الحلول المطلوبة لـ Expo:

### 1. تفعيل APIs الصحيحة في Google Cloud Console

#### أ) اذهب إلى:
```
https://console.cloud.google.com/apis/library?project=growupe-83565
```

#### ب) ابحث عن وفعّل:
```
Google Identity Toolkit API
Google Identity and Access Management (IAM) API
Google Identity Services API
Google OAuth2 API
```

### 2. إكمال OAuth Consent Screen

#### أ) اذهب إلى:
```
https://console.cloud.google.com/apis/credentials/consent?project=growupe-83565
```

#### ب) أكمل جميع الحقول:
```
App name: growup-auth
User support email: salaheddinetabet05@gmail.com
App logo: [أضف شعار التطبيق]
Application home page: https://growupe-83565.firebaseapp.com
Privacy policy: https://growupe-83565.firebaseapp.com/privacy
Terms of service: https://growupe-83565.firebaseapp.com/terms
```

#### ج) أضف Scopes:
```
openid
profile
email
```

#### د) أضف Authorized Domains:
```
growupe-83565.firebaseapp.com
expo.io
expo.dev
```

### 3. فحص Credentials

#### أ) اذهب إلى:
```
https://console.cloud.google.com/apis/credentials?project=growupe-83565
```

#### ب) تأكد من صحة Client IDs:
```
Android: 612098820148-dvpi00tc6m9fcotm58hbd6hf41fo3n73.apps.googleusercontent.com
iOS: 612098820148-f7gu5hpkmqv77npnemadrgm0on69djid.apps.googleusercontent.com
Web: 612098820148-dvpi00tc6m9fcotm58hbd6hf41fo3n73.apps.googleusercontent.com
```

### 4. إعدادات Expo المطلوبة

#### أ) تأكد من app.json:
```json
{
  "expo": {
    "android": {
      "package": "com.ibrahim.grow",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.ibrahim.grow"
    }
  }
}
```

#### ب) تأكد من google-services.json:
```json
{
  "client": [
    {
      "client_info": {
        "package_name": "com.ibrahim.grow"
      },
      "oauth_client": [
        {
          "client_id": "612098820148-dvpi00tc6m9fcotm58hbd6hf41fo3n73.apps.googleusercontent.com"
        }
      ]
    }
  ]
}
```

## 🧪 اختبار التطبيق:

### 1. أعد بناء التطبيق:
```bash
expo prebuild --clean
expo run:android
```

### 2. راقب Console Logs:
ابحث عن:
- `✅ ID Token from Google: [token]`
- `❌ Login error: [details]`

## 🆘 إذا استمرت المشكلة:

### 1. تحقق من Expo Development Build:
```bash
expo install expo-dev-client
```

### 2. تحقق من Google Sign-In Plugin:
```bash
expo install @react-native-google-signin/google-signin
```

### 3. تحقق من Firebase Config:
```bash
expo install firebase
```

## 🎯 الهدف:

حل مشكلة `invalid_request: 400` في Expo وجعل Google Sign-In يعمل بشكل صحيح.

## 📱 نصائح خاصة بـ Expo:

1. **استخدم Development Build** بدلاً من Expo Go
2. **تأكد من تحديث جميع التبعيات**
3. **أعد بناء التطبيق** بعد كل تغيير
4. **راقب Console Logs** بعناية

## 🔍 تشخيص إضافي:

إذا استمرت المشكلة، جرب:
1. **حذف node_modules وإعادة التثبيت**
2. **حذف cache وإعادة البناء**
3. **فحص إعدادات Firebase Console**
4. **تأكد من صحة SHA-1 fingerprints**
