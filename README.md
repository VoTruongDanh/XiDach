# 🎴 Xi Dách - Blackjack Scorekeeper

A modern, elegant scorekeeper application for Blackjack (Xi Dách) games. Built with React, TypeScript, and Tailwind CSS, featuring a luxurious dark theme and seamless multi-table management.

![Xi Dách Banner](https://img.shields.io/badge/Xi%20D%C3%A1ch-Scorekeeper-gold?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)

---

<div align="center">

### 🌐 [**LIVE DEMO**](https://xi-dach.vercel.app/) 🌐

**Try it now:** [https://xi-dach.vercel.app/](https://xi-dach.vercel.app/)

</div>

---

## ✨ Features

- 🎯 **Multi-Table Management** - Create and manage multiple game sessions simultaneously
- 💾 **Auto-Save** - All game data persists in browser LocalStorage
- 📱 **Mobile-First Design** - Optimized 2-column layout for mobile devices
- 🎨 **Dark Luxury Theme** - Glassmorphism UI with smooth animations
- ⚡ **Real-time Updates** - Instant score tracking with visual feedback
- 🔄 **Session Switching** - Seamlessly switch between active tables
- 🗑️ **Easy Cleanup** - Delete old game sessions with one click

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/VoTruongDanh/XiDach.git

# Navigate to the app directory
cd XiDach/xi-dach-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 📦 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)

For detailed deployment instructions, see [DEPLOY.md](../DEPLOY.md)

## 🎮 Usage

1. **Create a Table**: Click "New Table" and enter table name and player names
2. **Track Scores**: Use +/- buttons or custom input to update scores
3. **Switch Tables**: Return to dashboard to view all active tables
4. **Resume Games**: Click any table card to continue playing
5. **Clean Up**: Delete finished tables using the trash icon

## 🛠️ Tech Stack

- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11.15
- **Icons**: Lucide React 0.468
- **State Management**: React Context + useReducer
- **Storage**: Browser LocalStorage

## 📁 Project Structure

```
xi-dach-app/
├── src/
│   ├── components/
│   │   ├── ActiveGame.tsx      # Main game interface
│   │   ├── Dashboard.tsx       # Table list & management
│   │   ├── EventSetup.tsx      # New table creation
│   │   ├── PlayerCard.tsx      # Player score card
│   │   └── Layout.tsx          # App layout wrapper
│   ├── contexts/
│   │   └── GameContext.tsx     # Global state management
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # App entry point
├── public/                     # Static assets
└── package.json
```

## 🎨 Design System

- **Primary Color**: Gold (#eab308)
- **Accent Color**: Emerald (#10b981)
- **Danger Color**: Red (#ef4444)
- **Background**: Dark slate with glassmorphism effects
- **Typography**: System fonts with tracking adjustments

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Võ Trường Danh**
- GitHub: [@VoTruongDanh](https://github.com/VoTruongDanh)

## 🙏 Acknowledgments

- Built with modern React best practices
- Inspired by luxury casino aesthetics
- Designed for Vietnamese Blackjack (Xi Dách) players

---

<p align="center">Made with ❤️ for the Xi Dách community</p>
