# gadizone Mobile App

React Native (Expo) mobile app for iOS and Android - exact copy of the web frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for testing)
- iOS Simulator (Mac only) or Android Emulator

### Fix npm cache (one-time)
If you encounter permission errors:
```bash
sudo chown -R $(whoami) ~/.npm
```

### Installation
```bash
cd mobile-app
npm install
```

### Running the App
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## 📁 Project Structure

```
mobile-app/
├── App.tsx                    # Main entry point
├── app.json                   # Expo configuration
├── src/
│   ├── navigation/            # React Navigation setup
│   │   └── index.tsx          # Bottom tabs + stacks
│   ├── screens/               # All screens
│   │   └── HomeScreen.tsx     # Home page
│   ├── components/
│   │   ├── common/            # Button, Card, Badge
│   │   └── home/              # CarCard, etc.
│   ├── services/
│   │   └── api.ts             # Backend API integration
│   └── theme/                 # Design system
│       ├── colors.ts          # Red-orange gradients
│       ├── typography.ts      # Inter font
│       └── spacing.ts         # Consistent spacing
└── assets/                    # Images, icons
```

## 🎨 Design System

Colors match the web frontend:
- **Primary**: Red (#DC2626) to Orange (#EA580C) gradient
- **Background**: White / Gray-50
- **Text**: Gray-900 (primary), Gray-500 (secondary)

## 🔗 Backend Integration

Uses the same backend as the web app:
- Production: `https://killerwhale-backend.onrender.com`
- Local: `http://192.168.X.X:5001`

To change the API URL, edit `src/services/api.ts`.

## 📱 Testing on Physical Device

1. Install **Expo Go** from App Store / Play Store
2. Run `npm start` in the mobile-app directory
3. Scan the QR code with your camera (iOS) or Expo Go (Android)

## 🏗️ Building for Production

### iOS (App Store)
```bash
npx eas build --platform ios
```

### Android (Play Store)
```bash
npx eas build --platform android
```

Requires Apple Developer ($99/year) and Google Play ($25 one-time) accounts.

## 📋 Features Implemented

- [x] Home Screen with all sections
- [x] Car Cards with price, specs, wishlist
- [x] Budget filtering
- [x] Brand grid
- [x] Bottom tab navigation
- [x] Red-orange gradient theme
- [ ] Model detail screen
- [ ] Comparison feature
- [ ] Search with AI
- [ ] News section
- [ ] User authentication
- [ ] EMI Calculator

## 🔧 Development Notes

This mobile app is designed to be a 1:1 replica of the web frontend.
All API endpoints and data structures are shared with the web version.
