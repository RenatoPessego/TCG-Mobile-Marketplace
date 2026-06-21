# Yu-Gi-Oh! TCG Marketplace & Companion App

> **Academic Achievement:** This project was developed as part of the "Ubiquitous Applications" course during an Erasmus+ exchange program, where it received a perfect **20/20** grade.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A feature-rich, full-stack mobile application that brings the Yu-Gi-Oh! trading card game to life. Built as a monorepo, the app seamlessly integrates a React Native (Expo) frontend with a Node.js/Express backend to deliver a complete card collecting, trading, and marketplace ecosystem.

---

## Key Features

- **Card Collecting & Packs:** Simulate the thrill of opening booster packs using dynamic drop-rates and integrated data from the official YGOProDeck API.
- **Marketplace & Trading:** List your rare cards on the market, browse other users' listings, and use in-game currency to buy and sell.
- **Real-Time Messaging:** Negotiate trades or chat directly with other duelists regarding specific market listings.
- **Push Notifications:** Stay updated instantly when your cards are sold or when you receive new messages, powered by Expo Server SDK.
- **Location-Based Rewards:** Earn coins and special bonuses by utilizing device geolocation to check-in at real-world points of interest.
- **Light & Dark Mode:** Fully dynamic theme support throughout the application UI.

## Architecture & Tech Stack

This project is structured as a **Monorepo**, strictly separating concerns between the client interface and the server architecture:

### Frontend (`/mobile`)
- **Framework:** React Native managed by Expo
- **Styling:** NativeWind (Tailwind CSS for React Native) & Custom StyleSheet
- **Navigation:** React Navigation (Native Stack)
- **Features:** Geolocation, Push Notifications, Secure AsyncStorage, Context-based Theming

### Backend (`/backend`)
- **Server:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Passport.js (JWT & Local Strategy)
- **APIs:** YGOProDeck API for real-time Yu-Gi-Oh card cataloging

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI
- MongoDB instance (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/RenatoPessego/DigimonProject-ubiquitous.git
cd DigimonProject-ubiquitous
```

### 2. Backend Setup
Configure and launch the backend server.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory based on the `.env` template:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the server:
```bash
npm start
```
*The server runs by default on `http://localhost:5000`.*

### 3. Frontend Setup
Configure and run the Expo application.
```bash
cd mobile
npm install
```
Create a `.env` file in the `mobile/` directory:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```
Start the Expo development server:
```bash
npx expo start
```
*Use the Expo Go app on your physical device or run it on an iOS/Android emulator.*

## Testing

The codebase includes robust unit tests for both the frontend and the backend.

**Run Mobile Tests:**
```bash
cd mobile
npm test
```

**Run Backend Tests:**
```bash
cd backend
npm test
```

## Team

This project was designed and developed in collaboration by:

* **[Renato Pêssego](https://github.com/renatopessego)** — *Lead Developer & Software Architect*
  Responsible for the system architecture design, data modeling, backend implementation, and overall project management and testing.
  
* **[Lucas Neves](https://github.com/Snowluccs)** — *Developer*
  Responsible for development support, feature implementation, and testing.


## License

This project is licensed under the **0BSD License**. See the `package.json` for details.
