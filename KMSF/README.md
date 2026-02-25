# Kurdistan Medical and Scientific Federation (KMSF) Website

A modern, responsive React-based website for the Kurdistan Medical and Scientific Federation, established in 1988 to advance Kurdish healthcare and scientific excellence.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Design Principles](#design-principles)

## Project Overview

The Kurdistan Medical and Scientific Federation (KMSF) website serves as a professional portal for the organization to communicate with members and the public about their activities, events, and membership opportunities. The site was built with modern web development practices to provide an optimal user experience across all devices.

## Features

- **Responsive Design**: Mobile-first approach that works on all device sizes
- **Performance Optimized**: Lazy loading and code splitting for faster initial load times
- **Smooth Navigation**: Smooth scrolling to sections and animated transitions
- **Modern UI/UX**: Clean design with professional color scheme focused on gold/amber accents
- **SEO Friendly**: Proper semantic HTML structure and routing
- **Accessibility**: Keyboard navigable components and proper ARIA attributes

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Type safety and better developer experience

## Project Structure

```
KMSF/
├── src/
│   ├── assets/                 # Static assets like images
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── layout/                 # Layout components (Navbar, Footer)
│   ├── pages/                  # Page components
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Public assets
├── dist/                       # Build output
├── node_modules/              # Node dependencies
├── package.json               # Project dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd KMSF
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Deployment

The project is configured to be deployed on Netlify (as indicated by `netlify.toml`). The build process uses Vite's optimized build system.

## Design Principles

### Visual Design
- Professional color scheme with gold/amber accents representing excellence and tradition
- Clean, modern interface that conveys trust and expertise
- Consistent spacing and typography hierarchy
- Responsive layout that adapts to all screen sizes

### User Experience
- Smooth scrolling navigation between sections
- Mobile-friendly hamburger menu for smaller screens
- Backdrop blur effects on navbar when scrolled
- Loading states for better perceived performance
- Clear visual hierarchy and information architecture

### Technical Design
- Component-based architecture for maintainability
- Lazy loading of pages and sections for optimal performance
- Proper routing with React Router DOM
- TypeScript for enhanced code reliability
- Tailwind CSS for utility-first styling approach

## Navigation Structure

The website includes the following main navigation items:
1. Home
2. About
3. Events
4. Gallery
5. Archive
6. Membership
7. Donations
8. Contact

Each page is designed to be self-contained while maintaining consistent styling and user experience throughout the site.