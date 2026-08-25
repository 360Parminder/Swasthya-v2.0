# Swasthya App 📱

> **Your All-In-One Health, Medication, Sleep & Care Circle Companion**  
> Built with **React Native**, **Notifee**, **Firebase Cloud Messaging**, **Hugeicons**, and **Node.js/MongoDB**.

---

## 🌟 Overview

**Swasthya App** is a next-generation holistic health management mobile application designed to empower individuals and families to take control of their well-being. From intelligent medication tracking with automated dose reminders and refill alerts, to comprehensive sleep architecture analysis and care circle coordination, Swasthya seamlessly connects personal health with family care.

---

## ✨ Key Features & Screen Modules

### 💊 1. Medication & Prescription Management
- **Smart Medication Scheduling**: Add medications with custom forms (Tablets, Capsules, Syrup, Injections, Drops, Inhalers, Powder), dosage units (mg, ml, puffs), frequencies (Daily, Weekly, Specific Days), and multiple scheduled dose timings.
- **Interactive Daily Dose Tracker**: 1-tap dose logging (`TAKEN` / `SKIPPED`) with optimistic UI updates and instant audio feedback.
- **Adherence & Progress Ring**: Live visual adherence percentage meter, total dose metrics, and next scheduled dose highlight.
- **Prescription Refill Alerts & Inventory System**:
  - Calculates remaining days of supply based on daily intake frequencies.
  - Color-coded stock status tagging (`CRITICAL`, `LOW_STOCK`, `HEALTHY`).
  - 1-tap Quick Refill presets (`+15`, `+30`, `+60` doses) and custom manual refill quantity modal.
- **Medication History & Adherence Logs**:
  - Horizontal interactive date carousel for quick timeline navigation.
  - Visual adherence score gauge and daily intake statistics (Scheduled, Taken, Skipped, Pending).
  - Detailed chronological timeline logs with time stamps.

---

### 🤝 2. Care Circle & Family Health Network
- **Family & Relative Prescriptions**: Prescribe and track medications for children, elderly parents, or relatives directly from your account.
- **Live Care Network Oversight**: Toggle between **"Myself"** and **"Care Circle"** prescriptions with recipient member badges (`👤 For: Sarah M.`).
- **Connection Management**:
  - Real-time user search by name, email, or unique `@userId`.
  - Send, accept, decline, or cancel care circle connection invitations.
  - Shared health vitals, active prescription visibility, and emergency care contacts.

---

### 🌙 3. Sleep Architecture & Smart Schedule
- **Sleep Details & Stage Breakdown**:
  - **Radial Sleep Score Ring** (0–100 scale) with dynamic visual quality indicators.
  - **Interactive Hypnogram Gauge**: Stacked multi-color breakdown of Deep Sleep, REM, Core Sleep, and Awake duration.
  - **7-Day Trend Analysis**: Bar chart tracking weekly sleep duration against the 8-hour target.
  - **Biometrics Grid**: Heart Rate range (bpm), Respiratory Rate (brpm), and Blood Oxygen (SpO2).
  - **Smart Sleep Tips & Bedtime Checklist**: Interactive checklist (e.g. Dim Blue Light, Cool Room, No Late Caffeine, Meditation).
- **Sleep Schedule & Cycle Calculator**:
  - Optimal 90-minute sleep cycle calculator with recommended bedtime options based on your target wake-up time.
  - Interactive Bedtime & Wakeup dials with increment/decrement controls.
  - Wind-down lead time selector (`15m`, `30m`, `45m`, `60m`).
  - Smart Sunrise light alarm toggle and active day schedule selector (`Mon`–`Sun`).

---

### 💧 4. Hydration & Vital Tracking
- **Smart Water Intake Tracker**: Interactive fluid consumption logger with customizable container sizes (`250ml`, `500ml`, `750ml`, `1000ml`).
- **Daily Target Goal Ring**: Visual progress towards optimal hydration targets.
- **Hydration Logs & Reminder Notifications**: Periodic drink water alerts.

---

### 🏋️ 5. Physical Activity & Nutrition
- **Step & Calorie Counter**: Real-time physical activity monitoring with daily milestone badges.
- **Workout Planner**: Guided routines, exercise logs, and fitness goal setting.
- **Food Diary & Calorie Counter**: Macronutrient tracking (Carbs, Protein, Fats) and meal logging.

---

### 🔔 6. Notifications & Intelligent Alerts
- **Centralized Alert Hub**: Segmented filtering for **All Alerts**, **Circle Invites**, **Refills**, and **Health Feed**.
- **Care Circle Invite Actions**: Instant 1-tap Accept or Decline with optimistic UI removal.
- **Real-Time Push Notifications**: Firebase Cloud Messaging (FCM) + Notifee background dose alarms and remote circle alerts.
- **Device Token Logging**: Native iOS APNs & FCM push token output for testing and device synchronization.

---

## 🎨 Design System & UI Highlights

- **Aesthetic**: Premium health-tech interface built with glassmorphism, refined gradients, subtle borders, and smooth shadows.
- **Theme**: Seamless **Light Mode** and **OLED Dark Mode** powered by `useThemeColors()`.
- **Iconography**: Complete `@hugeicons/react-native` free icon suite.
- **Audio Feedback**: Subtle auditory haptics on dose tracking and button actions.

---

## 📂 Project Structure

```
Swasthya-app/
├── App.tsx                        # Root app component, FCM listeners & Notifee setup
├── index.js                       # App entry point
├── package.json                   # Dependencies and scripts
├── ios/                           # Native iOS project (Xcode, Pods, AppDelegate.swift)
├── android/                       # Native Android project (Gradle, Manifest)
└── src/
    ├── api/                       # Axios API services (auth, medication, connection, sleep, hydration)
    ├── components/
    │   ├── model/                 # Modal components (AddMedication, AddConnection, RefillModal)
    │   └── ui/                    # Design tokens & color palettes (colors.js)
    ├── config/                    # Toast and app configurations
    ├── context/                   # React Contexts (AuthContext, ConnectionContext)
    ├── navigation/                # React Navigation stacks & bottom tabs (MainNavigator.jsx)
    ├── screens/
    │   ├── auth/                  # Login, Register, Forgot Password
    │   ├── connections/           # Care Circle & Connection list
    │   ├── home/                  # Home dashboard, Quick Vitals, Alarms
    │   ├── Hydration/             # Water intake logger & history
    │   ├── medication/            # Medication list, History, Refill Alerts
    │   ├── notifications/         # Notifications & Invites hub
    │   ├── profile/               # User profile, settings, health data
    │   └── sleep/                 # SleepDetailsScreen, SleepScheduleScreen
    └── services/                  # Background services (NotificationService, SoundService)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm** or **yarn**
- **CocoaPods** (for iOS: `sudo gem install cocoapods`)
- **Xcode** (for macOS / iOS development)
- **Android Studio** & Android SDK (for Android development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/360Parminder/Swasthya-v2.0.git
   cd Swasthya/Swasthya-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install iOS Pods (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run on iOS Simulator / Device:**
   ```bash
   npx react-native run-ios
   ```

5. **Run on Android Emulator / Device:**
   ```bash
   npx react-native run-android
   ```

---

## 📄 License
This project is licensed under the MIT License.