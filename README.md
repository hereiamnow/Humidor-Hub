
# Humidor Hub

## Application Overview

Humidor Hub is a modern web and mobile-friendly application for cigar enthusiasts to manage, analyze, and enjoy their cigar collections. It provides a comprehensive inventory system, multi-humidor support, AI-powered insights, and a beautiful, responsive interface. The app is built with React, Tailwind CSS, and integrates with Firebase for authentication and data storage. It also features Google Gemini API integration for AI summaries and supports Govee sensor emulation for environmental monitoring.

## Features

- **Dashboard Overview:** See live stats, collection value, and quick insights at a glance.
- **Multi-Humidor Management:** Add, edit, and organize multiple humidors, each with its own cigars.
- **Cigar Inventory:**
  - Add cigars with detailed attributes (brand, name, shape, size, wrapper, binder, filler, strength, country, price, notes, and images).
  - Edit, move, or bulk-manage cigars between humidors.
- **Data Analysis & AI Insights:**
  - Visualize your collection by brand, country, and strength with interactive charts.
  - Get AI-powered summaries and tasting notes using the Gemini API.
- **Aging & Statistics Panels:**
  - See your oldest cigars and their aging status.
  - Browse by wrapper, strength, or country with dynamic panels.
- **Customization:**
  - Multiple color themes (light/dark), font options, and personalized settings.
  - Export/import your collection as CSV or JSON.
- **Alerts & Integrations:**
  - Mock alerts for humidity/temperature thresholds.
  - Govee sensor emulation for environmental data.
- **Roxy's Corner:**
  - Helpful tips, fun facts, and AI-powered collection summaries.

## Tech Stack

- **Frontend:** React.js
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **AI:** Google Gemini API
- **Backend/Hosting:** Firebase (Firestore, Auth, Emulators)
- **Mobile Integration:** Capacitor (Android support)

## Development Environment Setup

Follow these steps to set up and run Humidor Hub locally:

### Prerequisites

- **Node.js** (v18+ recommended) and **npm**. Download from [nodejs.org](https://nodejs.org/).
- **Firebase CLI** (for emulators and deployment):
  ```powershell
  npm install -g firebase-tools
  ```

### Setup Steps

1. **Clone the repository:**
   ```powershell
   git clone <your-repo-url>
   cd Humidor-Hub
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the project root (if using Gemini API):
     ```env
     REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Start the development server and Firebase emulators:**
   ```powershell
   npm start
   ```
   This runs both the React app and Firebase emulators concurrently.

5. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - Firebase Emulator UI: [http://localhost:5000](http://localhost:5000)

### Additional Commands

- **Run tests:**
  ```powershell
  npm test
  ```
- **Build for production:**
  ```powershell
  npm run build
  ```
- **Deploy to Firebase Hosting:**
  ```powershell
  npm run deploy
  ```

---
For more details, see the `SETUP.md` and in-app documentation.
