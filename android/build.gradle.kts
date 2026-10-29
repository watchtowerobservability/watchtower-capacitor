plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "dev.watchtower.capacitor"
    compileSdk = 34
    defaultConfig { minSdk = 24 }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

repositories {
    google()
    mavenCentral()
}

dependencies {
    implementation(project(":capacitor-android"))
    // The native SDK (sdks/android) as a local module until it is on a Maven registry:
    // add `include(":watchtower-android")` in the app's settings.gradle with projectDir at the downloaded sources.
    implementation(project(":watchtower-android"))
}
