---
name: AutoLog Pro — Design System
colors:
  surface: "#f7fafd"
  surface-dim: "#d7dadd"
  surface-bright: "#f7fafd"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f1f4f7"
  surface-container: "#ebeef1"
  surface-container-high: "#e5e8eb"
  surface-container-highest: "#e0e3e6"
  on-surface: "#181c1e"
  on-surface-variant: "#44474d"
  inverse-surface: "#2d3133"
  inverse-on-surface: "#eef1f4"
  outline: "#75777e"
  outline-variant: "#c5c6ce"
  surface-tint: "#4e5f7e"
  primary: "#031632"
  on-primary: "#ffffff"
  primary-container: "#1a2b48"
  on-primary-container: "#8293b5"
  inverse-primary: "#b6c7eb"
  secondary: "#a04100"
  on-secondary: "#ffffff"
  secondary-container: "#fe6b00"
  on-secondary-container: "#572000"
  tertiary: "#001538"
  on-tertiary: "#ffffff"
  tertiary-container: "#00295f"
  on-tertiary-container: "#4f90ff"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#d7e2ff"
  primary-fixed-dim: "#b6c7eb"
  on-primary-fixed: "#081b38"
  on-primary-fixed-variant: "#374765"
  secondary-fixed: "#ffdbcc"
  secondary-fixed-dim: "#ffb693"
  on-secondary-fixed: "#351000"
  on-secondary-fixed-variant: "#7a3000"
  tertiary-fixed: "#d8e2ff"
  tertiary-fixed-dim: "#adc6ff"
  on-tertiary-fixed: "#001a41"
  on-tertiary-fixed-variant: "#004493"
  background: "#f7fafd"
  on-background: "#181c1e"
  surface-variant: "#e0e3e6"
  # Dark Mode Colors
  dark-surface: "#0f172a"
  dark-surface-dim: "#0b1120"
  dark-surface-bright: "#1e293b"
  dark-surface-container-lowest: "#020617"
  dark-surface-container-low: "#131c31"
  dark-surface-container: "#1a2338"
  dark-surface-container-high: "#222b40"
  dark-surface-container-highest: "#2a3348"
  dark-on-surface: "#e2e8f0"
  dark-on-surface-variant: "#94a3b8"
  dark-outline: "#475569"
  dark-outline-variant: "#334155"
  dark-primary-container: "#1e3a5f"
  dark-on-primary-container: "#93b4e6"
  dark-secondary-container: "#7a3000"
  dark-on-secondary-container: "#ffb693"
  dark-tertiary-container: "#003d7a"
  dark-on-tertiary-container: "#7ab0ff"
  dark-background: "#0f172a"
  dark-on-background: "#e2e8f0"
typography:
  headline-lg:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: "700"
    lineHeight: 38px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-main: 1rem
  gutter-card: 0.75rem
  stack-sm: 0.25rem
  stack-md: 1rem
  stack-lg: 1.5rem
---

## Brand & Style

The brand personality of this design system is rooted in **Reliability, Precision, and Utility**. It is designed for vehicle owners who value transparency and professional-grade maintenance tracking. The UI must evoke a sense of mechanical confidence—everything should feel solid, well-oiled, and organized.

The chosen aesthetic is **Corporate / Modern**, specifically optimized for the Android ecosystem. It leverages structured information density with a clean, high-utility interface. By prioritizing functional clarity over decorative flair, the design system ensures that critical vehicle health data is immediately accessible, mimicking the legibility of a high-end digital dashboard.

## Colors

The palette is engineered to build trust through a "Mechanic's Navy" and high-visibility accents.

- **Primary:** A deep, authoritative blue (#1A2B48) used for headers, navigation, and primary branding to establish a professional foundation.
- **Secondary:** A vibrant safety orange (#FF6B00) used for critical alerts, "Needs Attention" status indicators, and primary Call-to-Action buttons.
- **Tertiary:** An electric blue (#007AFF) utilized for interactive elements, links, and "Good" health status indicators to maintain a tech-forward feel.
- **Neutral:** A range of professional grays, starting with a cool-toned background (#F4F7FA) to reduce glare and emphasize the card-based layout.
- **EV Accent:** Green tones (#059669) used to distinguish electric vehicles from fuel vehicles in the UI.

## Typography

This design system utilizes a dual-font strategy to balance character with readability.

**Manrope** is used for all headlines and numeric readouts (like mileage or service costs). Its modern, geometric construction feels precise and technical. **Inter** is used for all body copy and UI labels due to its exceptional legibility at small sizes on mobile screens.

Status labels should always use uppercase with slight letter spacing to differentiate them from standard body text. Data-heavy lists should prioritize the `body-md` size for optimal information density without sacrificing clarity.

## Layout & Spacing

The layout follows a **Fluid Grid** model designed for the vertical orientation of mobile devices. A 4-column grid is used for the mobile portrait view.

- **Margins:** A consistent 16px (1rem) outer margin ensures content doesn't bleed into the screen edges.
- **Card Rhythm:** History items are organized into cards with 12px (0.75rem) vertical spacing between them to create a clear "timeline" feel.
- **Information Groups:** Related data points within a card (e.g., Date, Service Type, Cost) use a tight 4px (0.25rem) stack to maintain visual association.
- **Bottom Navigation:** A persistent navigation bar is docked at the bottom of the screen, utilizing a 72px height to account for modern mobile gesture areas and ergonomic thumb-reach.

## Elevation & Depth

To maintain a clean and reliable aesthetic, this design system uses **Tonal Layers** combined with **Ambient Shadows**.

- **Surface Level:** The main background is the light neutral gray.
- **Card Level:** Service cards and health modules are pure white (#FFFFFF). They use a very subtle, diffused shadow (4px Y-offset, 12px blur, 4% opacity) to lift them slightly from the background.
- **Active State:** Elements being interacted with or "pinned" items use a low-contrast outline (1px solid in a light gray-blue) rather than increased shadow to avoid a cluttered look.
- **Overlays:** Modals and bottom sheets use a standard backdrop dim (40% opacity) to focus the user on critical input tasks like adding a new service record.
- **Glassmorphism:** The Bottom Navigation and Top Header utilize a 20px blur with 80% opacity backgrounds to create a layered, modern feel that maintains context while reducing visual weight.

## Shapes

The shape language is **Rounded**, reflecting the modern industrial design of contemporary vehicles.

- **Standard Elements:** Buttons and input fields use a 0.5rem radius, providing a friendly but professional feel.
- **Service Cards:** Use `rounded-lg` (1rem) to softly containerize complex service history data.
- **Health Indicators:** Status chips and icons for vehicle parts (engine, tires, brakes) are often contained in circular or high-radius containers to appear as "gauges."

## Components

### Vehicle Switcher

A click-activated dropdown in the top app bar that lists all vehicles with their type icon (Car/Motorcycle), model, plate, and fuel type. Active vehicle is highlighted with a checkmark. Includes an "Add Vehicle" action at the bottom.

The dropdown uses a state-based toggle (`vehicleDropdownOpen`) rather than CSS `:hover`, ensuring reliable access on mobile and touch devices. A semi-transparent backdrop overlay dismisses the dropdown when tapped outside. The dropdown animates in/out using `AnimatePresence` with a spring-based `motion.div`.

### Profile Picture

A circular avatar in the top app bar that doubles as an upload button. Hover reveals a camera overlay. Stores as base64 in localStorage. Also editable in Settings.

### Buttons & Inputs

- **Primary Button:** High-contrast Navy or Orange with `headline-sm` centered text.
- **Input Fields:** Outlined style with a subtle gray border that turns Primary Blue on focus. Labels should float or stay docked above the field.

### Service History Cards

These are the core of the application. They must include:

- **Left Rail Icon:** A circular icon representing the service type (e.g., Oil Can, Wrench, Tire).
- **Primary Title:** The service name (e.g., "Full Synthetic Oil Change").
- **Metadata Row:** Date and Workshop in `label-sm` gray text.
- **Cost Badge:** Green-colored cost display using `DollarSign` icon + formatted currency.

### Total Spending Card

A dark gradient card (slate-900 to slate-800) on the dashboard showing the sum of all service/repair costs for the active vehicle, with a record count.

### Vehicle Health Indicators

A specialized component featuring a 3-tier color system:

- **Green (Tertiary Blue):** Healthy/Recently Serviced.
- **Yellow:** Upcoming Maintenance.
- **Orange (Secondary):** Overdue or Critical Repair.

### Chips & Tags

- Used for filtering history (e.g., "Repairs," "Maintenance," "Upgrades"). Chips use a pill-shape (full) with a light version of the primary color as a background and dark text.

### Bottom Navigation Tabs

- A high-density navigation component featuring 4 distinct views. Active states are indicated by a "pill" background and a color shift to Tertiary Blue. Transitions between tabs use a Spring animation with a `layoutId` for shared-element feel.

### Schedule Countdown Card

- A hero-level component using vibrant gradients (Blue/Indigo for healthy, Red/Rose for overdue). It provides immediate psychological weight to upcoming maintenance. Includes a **Reschedule** button that opens a dedicated modal.

### Add/Edit Vehicle Modal

A full form modal for adding or editing vehicles with fields for:

- Vehicle Type (Car / Motorcycle)
- Fuel/Power (Fuel / Electric)
- Model, Year, License Plate, VIN, Mileage, Owner, Next Service Date

### Add/Edit Record Modal

A form modal for service/repair records with:

- Type toggle (Service / Repair)
- Service Date / Repair Date (conditional)
- Next Service Due
- Cost (with `$` prefix)
- Description
- Workshop Name

### Reschedule Modal

A focused modal showing the current next service date and allowing the user to pick a new date. Updates the vehicle's `nextServiceDate` on submit.

### Empty State (No Vehicles)

When no vehicles exist in the system, the main content area displays a centered fallback UI instead of an empty dashboard:

- A large `Car` icon (48px) with reduced opacity
- "No vehicles found" headline
- "Add your first vehicle to get started" subtitle
- A prominent "Add Vehicle" primary button that opens the Add/Edit Vehicle modal

This ensures users are never left staring at a blank screen and are guided toward the first action.

## Dark Mode

AutoLog Pro includes a full dark theme that adapts all views, modals, navigation, and components.

### Implementation

Dark mode is controlled by a `darkMode: boolean` field in the `AppSettings` interface:

```typescript
interface AppSettings {
  units: "metric" | "imperial";
  notifications: boolean;
  darkMode: boolean; // toggles dark class on <html>
}
```

A `useEffect` hook toggles the `dark` CSS class on the `<html>` element whenever `settings.darkMode` changes:

```typescript
useEffect(() => {
  document.documentElement.classList.toggle("dark", settings.darkMode);
}, [settings.darkMode]);
```

### Toggle Points

- **Top Navbar**: Moon/Sun icon button next to the profile picture for quick access.
- **Settings Page**: Dedicated "Dark Mode" toggle switch in the App Preferences section.

### Dark Mode Color Palette

The dark palette uses a deep slate base (`#0f172a`) with subtle layered surfaces:

| Token                   | Light        | Dark         |
| ----------------------- | ------------ | ------------ |
| Background              | `#f7fafd`    | `#0f172a`    |
| Surface (cards)         | `#ffffff`    | `#1e293b`    |
| Surface (navbar/header) | `#ffffff/80` | `#1e293b/80` |
| On-Surface (text)       | `#181c1e`    | `#e2e8f0`    |
| On-Surface Variant      | `#44474d`    | `#94a3b8`    |
| Outline / Border        | `#e2e8f0`    | `#334155`    |
| Primary Container       | `#1a2b48`    | `#1e3a5f`    |
| Secondary Container     | `#fe6b00`    | `#7a3000`    |
| Tertiary Container      | `#00295f`    | `#003d7a`    |

### Component Dark Mode Styling

Every component accepts an optional `darkMode?: boolean` prop. When `true`, conditional class strings apply dark variants:

- **Header/Navbar**: `bg-slate-800/95 backdrop-blur-xl border-b border-slate-700`
- **Bottom Navigation**: `bg-slate-800/80 border-slate-700`
- **Cards & Sections**: `bg-slate-800 border border-slate-700`
- **Input Fields**: `bg-slate-700 border-slate-600 text-white`
- **Labels**: `text-slate-300`
- **Modals**: `bg-slate-800 border border-slate-700` with `bg-slate-700` inputs
- **Buttons (secondary)**: `bg-slate-700 hover:bg-slate-600 text-white`

### CSS Transitions

Smooth transitions between themes are applied globally:

```css
html {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
html.dark {
  background-color: #0f172a;
  color: #e2e8f0;
}
```

Date picker icons are inverted in dark mode for visibility:

```css
.dark input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
```

## Data Management Strategy

To ensure a seamless "utility" experience, AutoLog Pro implements **Zero-Latency Persistence** via `localStorage`. Every state change (vehicle details, unit toggles, new records, profile picture) is mirrored to local storage, allowing the app to function as a reliable local tool without the need for a backend for core individual tracking.

### Storage Keys

| Key                       | Content                                                     |
| ------------------------- | ----------------------------------------------------------- |
| `autolog_vehicles`        | Array of all vehicle objects                                |
| `autolog_activeVehicleId` | Currently selected vehicle ID                               |
| `autolog_records`         | Array of all service/repair records (scoped by `vehicleId`) |
| `autolog_settings`        | App preferences (units, notifications, darkMode)            |
| `autolog_profilePic`      | Base64-encoded profile image                                |

### Data Models

```typescript
interface Vehicle {
  id: string;
  type: "car" | "motorcycle";
  fuelType: "fuel" | "ev";
  model: string;
  year: string;
  mileage: number;
  vin: string;
  plate: string;
  owner: string;
  nextServiceDate: string;
}

interface ServiceRecord {
  id: string;
  vehicleId: string;
  type: "service" | "repair";
  serviceDate?: string;
  repairDate?: string;
  nextService: string;
  description: string;
  workshopName: string;
  cost: number;
}
```
