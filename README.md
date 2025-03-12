# Longo - Skill Marketplace App (Developer Version)

A React Native marketplace app connecting skilled professionals with clients. Built with Expo, Firebase, and Tamagui.

## 🚧 Development Status

⚠️ **IMPORTANT**: This is an early development version. Many features are incomplete or need refinement.

## 🎯 Current Development Focus

- Implementing core authentication flows
- Setting up basic CRUD operations
- Establishing database structure
- Creating essential UI components

## 🚀 Features

- Authentication (Email & Google Sign-in)
- Real-time messaging
- Live ads/projects
- Bidding system
- User profiles
- Points & leaderboard system
- Dark/Light mode support
- Push notifications

## 🛠 Tech Stack

- React Native with Expo
- Firebase (Authentication & Firestore)
- Tamagui UI Framework
- React Navigation
- Expo Vector Icons

## 📱 Screenshots



## 🏗 Project Structure 

src/ <br>
├── components/ # Reusable components <br>
├── navigation/ # Navigation configuration <br>
├── screens/ # App screens <br>
│ ├── auth/ # Authentication screens <br>
│ └── main/ # Main app screens <br>
├── services/ # Firebase services <br>
├── firebase.js # Firebase configuration <br>
└── App.js # Root component 


## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. Clone the repository:

bash
git clone [https://github.com/CODIEX0/Longo-mvp.git]
cd longo-app


2. Install dependencies:
bash
npm install


3. Create a Firebase project and add your configuration in `src/firebase.js`

4. Start the development server:
bash
npx expo start


### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email & Google)
3. Create a Firestore database
4. Add your Firebase config to `src/firebase.js`

## 🔑 Environment Variables

Create a `.env` file in the root directory:

env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id


## 📚 Collection Structure

### Firestore Collections:

- `users`: User profiles and data
- `ads`: Live advertisements/projects
- `bids`: Project bids
- `messages`: Chat messages
- `notifications`: User notifications

## 🧪 Testing
bash
npm test


## 📱 Building for Production

### iOS
bash
eas build --platform ios


### Android
bash
eas build --platform android


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Copyright © 2024 Longo. All rights reserved.

This project and its contents are protected by copyright law. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited. All rights are reserved by Longo and its owners.

For licensing inquiries, please contact Longo.app.africa@gmail.com

## 🐛 Known Issues & Limitations

⚠️ IMPORTANT: This app is currently in early development stage and contains numerous bugs and incomplete features. Major issues include:

- Core functionality is still under development
- Many features are not fully implemented
- UI/UX needs significant improvement
- Performance optimizations are pending
- Authentication flows need refinement
- Error handling is incomplete
- Testing coverage is minimal
