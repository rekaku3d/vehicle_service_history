<div align="center">
<img width="200" height="475" alt="AutoLog Pro Banner" src="/screen.png" />
</div>

# AutoLog Pro

**AutoLog Pro** is a high-performance vehicle service history and maintenance tracking application. Designed with a premium, industrial aesthetic, it helps vehicle owners manage multiple vehicles — cars and motorcycles, fuel or electric — with precision and ease.

## 🚀 Key Features

- **Multi-Vehicle Management**: Add, switch, and manage multiple vehicles (car/motorcycle, fuel/EV) from a single dashboard.
- **Dynamic Dashboard**: Real-time overview of vehicle health, current mileage, total spending, and recent service history per vehicle.
- **Service History**: A searchable, filterable archive of all maintenance and repair records with direct edit/delete capabilities.
- **Cost Tracking**: Record service and repair costs with automatic total spending calculation per vehicle.
- **Maintenance Schedule**: An intelligent roadmap that calculates upcoming service milestones and days remaining until your next visit.
- **Reschedule**: Easily reschedule your next service date from the schedule view.
- **Vehicle Profile**: Manage core vehicle details including VIN, Owner, License Plate, and Next Service targets.
- **Profile Picture**: Upload a profile photo that persists across sessions.
- **Dark Mode**: Full dark theme with a toggle in the top navbar and Settings page. Persists across sessions via `localStorage`.
- **Click-Activated Vehicle Switcher**: The vehicle dropdown now opens on click (not hover), ensuring reliable access on mobile and touch devices.
- **Empty State Handling**: Dashboard displays a helpful fallback UI when no vehicles are added, guiding users to add their first vehicle.
- **Persistence**: All data is automatically saved to your browser's `localStorage`, ensuring your records are safe across sessions.

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 6
- **Native Platform**: Capacitor 8 (Android support)
- **Styling**: Tailwind CSS 4 + Motion (Framer Motion)
- **Icons**: Lucide React
- **Language**: TypeScript 5.8
- **Design**: Premium Industrial UX with Glassmorphism, Spring Animations, and Dark Mode support

## 📱 Mobile App (Android)

AutoLog Pro is packaged as a native Android application using Capacitor.

### Prerequisites for Android Build
- **Java**: JDK 17 (recommended) or JDK 21
- **Android SDK**: Installed and configured (default path: `~/Android/Sdk`)
- **Capacitor CLI**: `npx cap`

### Build Instructions

1. **Build the web project:**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor:**
   ```bash
   npx cap sync android
   ```

3. **Generate APK:**
   ```bash
   cd android && ./gradlew assembleDebug
   ```

The generated APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

## 💻 Run Locally

**Prerequisites:** Node.js (v18+), Java 17 (for Android)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the app:**

   ```bash
   npm run dev
   ```

3. **Open the browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal).

## 📁 Project Structure

```
src/
├── App.tsx      # Main application component with all views
├── main.tsx     # Entry point
└── index.css    # Global styles, Tailwind imports, and dark mode overrides
```

## 🧭 Navigation

| Tab           | Description                                                                        |
| ------------- | ---------------------------------------------------------------------------------- |
| **Dashboard** | Vehicle overview, health indicators, total spending, quick actions, recent records |
| **History**   | Full searchable/filterable list of all service and repair records                  |
| **Schedule**  | Countdown to next service, maintenance roadmap, reschedule button                  |
| **Settings**  | Profile picture, vehicle details, all vehicles list, app preferences, dark mode    |

## 🌙 Dark Mode

Toggle dark mode via the **Moon/Sun icon** in the top navbar or the **Dark Mode switch** in Settings. The preference is persisted in `localStorage` under `autolog_settings` and applies a `dark` class to the `<html>` element. All views, modals, and navigation elements adapt with smooth transitions.

---

Built with precision for the modern driver. 🚗✨
