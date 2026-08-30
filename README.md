# Alvin Button Effect Application

A React Native (Android) app — one screen with **6 gradient/glow buttons** in a
responsive grid. Each button plays a **different animated effect** (pop, spin, shake,
pulse, bounce, flip), preceded by an animated splash screen. All animations run on the
native UI thread (`useNativeDriver`), so it stays smooth with no jank.

- **Package:** `com.alvin.buttoneffect`
- **Stack:** React Native 0.87 · TypeScript · Hermes · New Architecture
- **Release APK is minified & obfuscated with R8.**

---

## 1. Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 (tested on 22.x) |
| npm | ≥ 9 |
| JDK | **17** (`JAVA_HOME` must point to it) |
| Android SDK | Platform 36 + build-tools (via Android Studio); `ANDROID_HOME` set |
| Device | Android phone with **USB debugging on**, or an emulator |

> This zip ships **without `node_modules`** — install them first (step 2).

---

## 2. Install dependencies (required first)

```bash
npm install
```

## 3. Adjust the Android SDK path

Open `android/local.properties` and set `sdk.dir` to **your** SDK path:

```properties
# Windows
sdk.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk
# macOS:  sdk.dir=/Users/<you>/Library/Android/sdk
# Linux:  sdk.dir=/home/<you>/Android/Sdk
```

> Default path is above; if unsure, check Android Studio → **Settings → Languages &
> Frameworks → Android SDK**. A wrong path makes the build fail with `SDK location not found`.

## 4. Run on a device / emulator

```bash
adb devices          # confirm the device shows up

npm run android      # terminal 1 — builds the debug app, installs, connects to Metro
```

The app installs and hot-reloads on save.

---

## 5. Build the release APK (optional)

```bash
cd android
./gradlew assembleRelease        # Windows: .\gradlew.bat assembleRelease
```

Output: `android/app/build/outputs/apk/release/AlvinButtonEffectApplication.apk`

Install it directly:

```bash
adb install android/app/build/outputs/apk/release/AlvinButtonEffectApplication.apk
```

> On a real phone, Google Play Protect may show a one-time "isn't compatible…" prompt
> the first time a **sideloaded** app is opened — tap OK. It's a Play Protect notice for
> apps not installed from the Play Store, not an issue with the app.

---