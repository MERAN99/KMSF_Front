# Kurdistan Medical and Scientific Federation (KMSF) Website - Project Summary

## Project Description
A modern, responsive React-based website for the Kurdistan Medical and Scientific Federation (KMSF), established in 1988 to advance Kurdish healthcare and scientific excellence through unified professional support and collaboration.

## Key Features
- **Responsive Design**: Mobile-first approach that works on all device sizes
- **Performance Optimized**: Lazy loading and code splitting for faster initial load times
- **Smooth Navigation**: Smooth scrolling to sections and animated transitions
- **Modern UI/UX**: Clean design with professional color scheme focused on gold/amber accents
- **SEO Friendly**: Proper semantic HTML structure and routing
- **Accessibility**: Keyboard navigable components and proper ARIA attributes

## Technology Stack
- **Frontend Framework**: React 19 with Vite build tool
- **Styling**: Tailwind CSS utility-first framework
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Type safety and better developer experience

## Project Structure
```
KMSF/
├── src/
│   ├── layout/     # Layout components (Navbar, Footer)
│   ├── pages/      # Page components (Home, About, Events, etc.)
│   ├── components/ # Reusable UI components
│   ├── hooks/      # Custom React hooks
│   └── assets/     # Static assets like images
├── public/         # Public assets
├── dist/           # Build output
├── package.json    # Project dependencies and scripts
└── vite.config.js  # Vite configuration
```

## Main Navigation
1. Home
2. About
3. Events
4. Gallery
5. Archive
6. Membership
7. Donations
8. Contact

## Deployment
- Configured for Netlify deployment
- Uses production build process with Vite
- Automatic redirect to index.html for all routes

## Performance Optimizations
- Lazy loading of pages and sections
- Code splitting with manual chunking
- Minification and source map optimization
- Proper routing with React Router DOM
- Responsive design principles

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint code quality checks
- `npm run preview` - Preview production build locally