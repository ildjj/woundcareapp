# Wound Care Pro

An AI-powered wound assessment and management application built with React Native, featuring the Bates-Jensen Wound Assessment Tool (BWAT) and advanced AI analysis capabilities.

## Features

- **Dashboard**: Overview of active assessments, healing progress, and critical cases
- **BWAT Assessment**: Complete Bates-Jensen Wound Assessment Tool implementation
- **AI Analysis**: AI-powered wound image analysis and treatment recommendations
- **Patient Management**: Comprehensive patient tracking and history
- **Healing Tracker**: Progress monitoring with charts and analytics
- **Settings**: App configuration and data management

## Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Android SDK
- Java Development Kit (JDK)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wound-care-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install React Native CLI globally**
   ```bash
   npm install -g @react-native-community/cli
   ```

4. **Install Android dependencies**
   ```bash
   npx react-native doctor
   ```

## Running the App

### Development Mode

1. **Start Metro bundler**
   ```bash
   npx react-native start
   ```

2. **Run on Android**
   ```bash
   npx react-native run-android
   ```

### Building APK

#### Debug APK
```bash
cd android
./gradlew assembleDebug
```
The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK
```bash
cd android
./gradlew assembleRelease
```
The APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

#### Bundle for Play Store
```bash
cd android
./gradlew bundleRelease
```
The AAB will be generated at: `android/app/build/outputs/bundle/release/app-release.aab`

## Project Structure

```
wound-care-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BWATAssessment.tsx
│   │   └── AIWoundAnalysis.tsx
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── AssessmentContext.tsx
│   │   └── DatabaseContext.tsx
│   └── screens/            # App screens
│       ├── DashboardScreen.tsx
│       ├── AssessmentScreen.tsx
│       ├── PatientScreen.tsx
│       ├── HealingTrackerScreen.tsx
│       ├── SettingsScreen.tsx
│       ├── AuthScreen.tsx
│       └── BWATAssessmentScreen.tsx
├── android/                # Android-specific files
├── App.tsx                 # Main app component
├── index.js               # Entry point
└── package.json           # Dependencies and scripts
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **React Navigation**: Navigation between screens
- **React Native Paper**: Material Design components
- **React Native Vector Icons**: Icon library
- **React Native Chart Kit**: Charts and graphs
- **React Native Image Picker**: Camera and gallery access
- **AsyncStorage**: Local data persistence

## BWAT Assessment Tool

The Bates-Jensen Wound Assessment Tool (BWAT) is a comprehensive wound assessment instrument that evaluates 13 wound characteristics:

1. **Size**: Wound size in cm²
2. **Depth**: Wound depth assessment
3. **Edges**: Wound edge characteristics
4. **Undermining**: Tissue undermining assessment
5. **Necrotic Tissue Type**: Type of necrotic tissue
6. **Necrotic Tissue Amount**: Percentage of necrotic tissue
7. **Exudate Type**: Type of wound exudate
8. **Exudate Amount**: Amount of exudate
9. **Skin Color**: Surrounding skin color
10. **Peripheral Edema**: Tissue edema assessment
11. **Peripheral Induration**: Tissue induration
12. **Granulation Tissue**: Granulation tissue assessment
13. **Epithelialization**: Epithelialization coverage

## AI Integration

The app includes AI-powered features for:
- Wound image analysis
- Treatment recommendations
- Healing progress analysis
- Risk assessment

## Permissions

The app requires the following permissions:
- **Camera**: For capturing wound images
- **Storage**: For saving and accessing images
- **Internet**: For AI analysis and data sync
- **Location**: For patient location tracking (optional)

## Development Notes

### Adding New Features
1. Create new components in `src/components/`
2. Add new screens in `src/screens/`
3. Update navigation in `App.tsx`
4. Add any new dependencies to `package.json`

### Styling
- Use React Native Paper components for consistency
- Follow Material Design guidelines
- Use the provided color scheme and typography

### State Management
- Use React Context for global state
- Local state for component-specific data
- AsyncStorage for persistent data

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

3. **Permission issues**
   - Ensure all required permissions are in `AndroidManifest.xml`
   - Request permissions at runtime for Android 6.0+

4. **Dependency issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.