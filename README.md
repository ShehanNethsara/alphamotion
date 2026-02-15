# 🏋️ AlphaMotion - Fitness & Workout App

AlphaMotion is a comprehensive mobile fitness application designed to help users track their health statistics, manage workout plans, and maintain a healthy lifestyle. Built with **React Native (Expo)**, it offers a seamless cross-platform experience on Android and iOS.



## 📱 Features

* **User Authentication:** Secure Login and Registration using Firebase Auth.
* **Onboarding System:** Collects user data (Age, Weight, Height, Gender) to personalize the experience.
* **Dashboard:** View active workouts and daily progress.
* **Profile Management:** Update user details and upload profile pictures (Powered by **Cloudinary**).
* **Workout Plans:** Categorized workout routines for different fitness levels (Beginner, Intermediate, Advanced).
* **BMI & Stats:** Tracks user body metrics stored in Firestore.



## 🛠️ Tech Stack

* **Frontend:** React Native, Expo, TypeScript
* **Backend:** Firebase (Authentication, Firestore Database)
* **Storage:** Cloudinary (Image Optimization & Storage)
* **Navigation:** Expo Router (File-based routing)
* **Styling:** NativeWind (Tailwind CSS)



## 📂 Project Structure

The project follows a modular architecture for better scalability.

AlphaMotion/
├── app/                  # Screens & Navigation (Expo Router)
│   ├── (auth)/           # Login, Register Screens
│   ├── (dashboard)/      # Home, Profile, Workouts
│   └── (onboarding)/     # User Info Collection
├── components/           # Reusable UI Components (Buttons, Cards)
├── context/              # Global State (Auth Context)
├── services/             # API Services (Firebase, Cloudinary)
├── config/               # Configuration Files (Firebase Keys)
└── assets/               # Images and Icons


## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js (v18 or higher)
* Expo CLI installed globally (`npm install -g expo-cli`)

### Installation


  **Install dependencies**
    npm install
    

  **Configure Environment**
    * Add your Firebase configuration in `config/firebase.ts`.
    * Add your Cloudinary credentials in `services/userService.ts`.

  **Run the App**
    npx expo start
  



 👤 Author

**Shehan Nethsara**
*Student at Shehan Nethsara
 GitHub: (https://github.com/ShehanNethsara/alphamotion.git)

Made with ❤️ using **React Native**.