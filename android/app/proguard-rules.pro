# ============================================================================
#  ProGuard / R8 rules for com.alvin.buttoneffect
#  Goal: aggressively minify & obfuscate app code to resist reverse engineering
#        while keeping React Native / Hermes / New Architecture working.
#
#  These rules are appended to getDefaultProguardFile("proguard-android-optimize.txt").
#  Most core RN keep-rules already ship as "consumer" rules inside the RN AARs;
#  the entries below are extra safety nets and hardening options.
# ============================================================================

# ----------------------------------------------------------------------------
#  Obfuscation hardening
# ----------------------------------------------------------------------------
# Keep line numbers for crash de-obfuscation, but hide the original source file
# name. Upload/keep the generated mapping.txt to symbolicate stack traces.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Do a few extra optimization passes.
-optimizationpasses 5
-allowaccessmodification

# Keep annotations / generics / native-related metadata that RN & JNI rely on.
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,Exceptions

# ----------------------------------------------------------------------------
#  JNI / native bridge (React Native relies heavily on these)
# ----------------------------------------------------------------------------
# Anything annotated @DoNotStrip / @KeepGettersAndSetters must survive.
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class * { *; }
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

# Keep native methods and classes that expose them.
-keepclasseswithmembernames,includedescriptorclasses class * {
    native <methods>;
}

# ----------------------------------------------------------------------------
#  React Native core / Fabric / TurboModules (New Architecture)
# ----------------------------------------------------------------------------
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

# Keep methods invoked from JS via @ReactMethod / props via @ReactProp.
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Keep your app's entry-point Application/Activity (referenced from the manifest).
-keep class com.alvin.buttoneffect.MainApplication { *; }
-keep class com.alvin.buttoneffect.MainActivity { *; }

# ----------------------------------------------------------------------------
#  Kotlin
# ----------------------------------------------------------------------------
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings { <fields>; }

# ----------------------------------------------------------------------------
#  Misc suppressions for common transitive deps
# ----------------------------------------------------------------------------
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.jetbrains.annotations.**

# ----------------------------------------------------------------------------
#  Add third-party library keep rules below as you install native modules,
#  e.g. react-native-reanimated, react-native-svg, etc.
# ----------------------------------------------------------------------------
