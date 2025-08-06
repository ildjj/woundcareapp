# Wound Care Pro - AI-Powered Wound Assessment & Management

A comprehensive React Native mobile application for wound assessment and management using AI technology and the Bates-Jensen Wound Assessment Tool (BWAT).

## 🚀 Features

### Core Features
- **BWAT Assessment Tool**: Complete implementation of the Bates-Jensen Wound Assessment Tool with all 13 assessment categories
- **AI-Powered Analysis**: Advanced AI wound analysis with image processing and treatment recommendations
- **Patient Management**: Comprehensive patient database with wound history tracking
- **Image Gallery**: Wound image management with timeline and comparison features
- **Progress Tracking**: Healing progress monitoring with charts and analytics
- **Dashboard**: Real-time statistics and critical alerts

### Technical Features
- **Cross-Platform**: Works on both Android and iOS
- **Offline Capable**: Local SQLite database for offline functionality
- **Secure**: Biometric authentication and data encryption
- **Scalable**: Modular architecture with context providers
- **Modern UI**: Material Design with React Native Paper

## 📱 Screenshots

The app includes the following main screens:
- **Dashboard**: Overview with statistics and quick actions
- **Assessment**: Comprehensive wound assessment forms
- **BWAT Tool**: Complete Bates-Jensen assessment implementation
- **AI Analysis**: AI-powered wound image analysis
- **Patient Management**: Patient list and details
- **Image Gallery**: Wound image management
- **Settings**: App configuration and data management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 11 or higher

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mobile-app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

### 4. Android Setup
Make sure you have Android Studio installed and configured with:
- Android SDK
- Android SDK Platform-Tools
- Android Emulator or physical device

### 5. Environment Configuration
Create a `.env` file in the root directory:
```env
# API Configuration
API_BASE_URL=https://your-api-url.com
API_KEY=your-api-key

# AI Service Configuration
AI_SERVICE_URL=https://your-ai-service.com
AI_API_KEY=your-ai-api-key

# App Configuration
APP_NAME=Wound Care Pro
APP_VERSION=1.0.0
```

## 🚀 Running the App

### Development Mode
```bash
# Start Metro bundler
npm start
# or
yarn start

# Run on Android
npm run android
# or
yarn android

# Run on iOS (macOS only)
npm run ios
# or
yarn ios
```

### Production Build

#### Android APK
```bash
# Build release APK
npm run build:apk
# or
yarn build:apk

# The APK will be generated at: wound-care-app.apk
```

#### Android Bundle (AAB)
```bash
# Build release bundle
cd android
./gradlew bundleRelease
```

## 📊 BWAT Assessment Tool

The app implements the complete Bates-Jensen Wound Assessment Tool with all 13 categories:

1. **Size**: Wound dimensions measurement
2. **Depth**: Tissue depth assessment
3. **Edges**: Wound edge characteristics
4. **Undermining**: Tunneling assessment
5. **Necrotic Tissue Type**: Tissue type classification
6. **Necrotic Tissue Amount**: Percentage estimation
7. **Exudate Type**: Drainage characteristics
8. **Exudate Amount**: Drainage volume
9. **Skin Color**: Surrounding tissue color
10. **Peripheral Tissue Edema**: Swelling assessment
11. **Peripheral Tissue Induration**: Tissue hardness
12. **Granulation Tissue**: Healing tissue assessment
13. **Epithelialization**: New tissue formation

### Scoring System
- **Minimal (≤13)**: Good healing potential
- **Mild (14-20)**: Requires monitoring
- **Moderate (21-30)**: Needs aggressive treatment
- **Severe (31-40)**: Immediate intervention required
- **Critical (>40)**: Life-threatening, surgical intervention needed

## 🤖 AI Features

### Wound Analysis
- Automatic wound type classification
- Severity assessment
- Tissue composition analysis
- Infection risk evaluation
- Treatment recommendations

### Image Processing
- Wound measurement automation
- Tissue type identification
- Healing progress tracking
- Image comparison tools

## 🗄️ Database Schema

### Patients Table
```sql
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  diagnosis TEXT,
  contactInfo TEXT,
  createdAt TEXT NOT NULL
);
```

### Assessments Table
```sql
CREATE TABLE assessments (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  patientName TEXT NOT NULL,
  woundType TEXT,
  woundLocation TEXT,
  woundStage TEXT,
  length REAL,
  width REAL,
  depth REAL,
  area REAL,
  painLevel TEXT,
  exudateType TEXT,
  exudateAmount TEXT,
  necroticTissue BOOLEAN,
  sloughTissue BOOLEAN,
  granulationTissue BOOLEAN,
  epithelializationTissue BOOLEAN,
  redness BOOLEAN,
  swelling BOOLEAN,
  warmth BOOLEAN,
  odor BOOLEAN,
  purulent BOOLEAN,
  bwatScore INTEGER,
  severity TEXT,
  recommendations TEXT,
  timestamp TEXT NOT NULL,
  FOREIGN KEY (patientId) REFERENCES patients (id)
);
```

### Wound Images Table
```sql
CREATE TABLE wound_images (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  assessmentId TEXT NOT NULL,
  imagePath TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (patientId) REFERENCES patients (id),
  FOREIGN KEY (assessmentId) REFERENCES assessments (id)
);
```

## 🔧 Configuration

### App Configuration
The app can be configured through the Settings screen:
- **Notifications**: Push notifications for critical cases
- **Auto Save**: Automatic assessment saving
- **Dark Mode**: Theme preference
- **Biometric Auth**: Fingerprint/Face ID authentication
- **Data Sync**: Cross-device synchronization
- **Image Quality**: Photo quality settings
- **Language**: Multi-language support

### API Integration
To integrate with external services, update the API configuration in the context files:
- Authentication service
- AI analysis service
- Data synchronization service
- Image storage service

## 📱 Supported Devices

### Android
- **Minimum**: Android 6.0 (API level 23)
- **Target**: Android 13 (API level 33)
- **Architecture**: ARM64, x86_64

### iOS
- **Minimum**: iOS 12.0
- **Target**: iOS 16.0
- **Devices**: iPhone, iPad

## 🔒 Security Features

- **Biometric Authentication**: Fingerprint and Face ID support
- **Data Encryption**: Local database encryption
- **Secure Storage**: Encrypted AsyncStorage
- **Network Security**: HTTPS-only API calls
- **Privacy Compliance**: HIPAA-compliant data handling

## 📈 Performance Optimization

- **Hermes Engine**: JavaScript engine optimization
- **Image Compression**: Automatic image optimization
- **Lazy Loading**: Component and image lazy loading
- **Memory Management**: Efficient memory usage
- **Background Processing**: Offline data processing

## 🧪 Testing

### Unit Tests
```bash
npm test
# or
yarn test
```

### Integration Tests
```bash
npm run test:integration
# or
yarn test:integration
```

### E2E Tests
```bash
npm run test:e2e
# or
yarn test:e2e
```

## 📦 Build & Deploy

### Android Release Build
```bash
# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cd android
./gradlew assembleRelease
```

### iOS Release Build
```bash
# Archive the app
xcodebuild -workspace ios/WoundCareMobile.xcworkspace -scheme WoundCareMobile -configuration Release -destination generic/platform=iOS -archivePath WoundCareMobile.xcarchive archive

# Export IPA
xcodebuild -exportArchive -archivePath WoundCareMobile.xcarchive -exportOptionsPlist exportOptions.plist -exportPath ./build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@woundcarepro.com
- **Documentation**: [docs.woundcarepro.com](https://docs.woundcarepro.com)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- **Bates-Jensen Wound Assessment Tool**: For the comprehensive wound assessment methodology
- **React Native Community**: For the excellent mobile development framework
- **Material Design**: For the beautiful UI components
- **Medical Professionals**: For domain expertise and feedback

---

**Wound Care Pro** - Empowering healthcare professionals with AI-powered wound assessment and management tools.