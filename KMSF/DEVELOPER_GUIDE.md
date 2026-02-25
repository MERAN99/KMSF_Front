# KMSF Website - Developer Guide

## Project Overview

This document provides comprehensive guidance for developers working with the Kurdistan Medical and Scientific Federation (KMSF) website codebase. The project is built using modern React technologies with Vite as the build tool.

## Getting Started

### Prerequisites
- Node.js version 18 or higher
- npm (comes with Node.js)
- Git for version control

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd KMSF

# Install dependencies
npm install

# Start development server
npm run dev
```

## Codebase Structure

### Main Directories
```
src/
├── assets/                 # Static assets (images, etc.)
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── layout/                 # Layout components (Navbar, Footer)
├── pages/                  # Page-level components
├── App.jsx                 # Main application component
├── main.jsx                # Entry point
└── index.css               # Global styles
```

### Key Files

#### `src/App.jsx`
Main application component that handles routing between all pages using React Router DOM. Implements lazy loading for better performance and includes the Navbar and Footer components.

#### `src/main.jsx`
Entry point of the application that renders the main App component within a React StrictMode context.

#### `src/layout/Navbar.jsx`
- Fixed navigation bar with responsive design
- Mobile hamburger menu implementation
- Scroll effect (backdrop blur when scrolled)
- Smooth scrolling to sections on home page
- Sign in button for membership access

#### `src/layout/Footer.jsx`
- Informational footer with organization details
- Quick links to important pages
- Contact information section
- Copyright notice

## Development Patterns

### Lazy Loading Implementation
The application uses React's lazy loading to improve initial load performance:
```javascript
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
```

### Routing Strategy
Uses React Router DOM for navigation:
- Main routes defined in App.jsx
- Smooth scrolling to sections on home page
- Hash-based navigation for section links

### Responsive Design
The application follows mobile-first approach using Tailwind CSS:
- Mobile menu for small screens
- Responsive grid layouts
- Adaptive spacing and sizing

## Performance Optimizations

### Code Splitting
Vite configuration includes manual chunking strategies:
```javascript
manualChunks: {
  vendor: ['react', 'react-dom'],
  router: ['react-router-dom'],
  motion: ['framer-motion'],
  icons: ['lucide-react']
}
```

### Loading States
- Custom loading spinners for lazy-loaded components
- Suspense boundaries to handle loading states gracefully

## Styling Approach

### Tailwind CSS Configuration
- Utility-first CSS framework
- Custom color palette with gold/amber accents
- Responsive design using Tailwind's breakpoints

### CSS Architecture
- Global styles in `index.css`
- Component-specific styling using Tailwind classes
- Consistent spacing and typography system

## Testing Strategy

### Manual Testing
1. Test all navigation links
2. Verify mobile menu functionality
3. Check responsive behavior on different screen sizes
4. Validate smooth scrolling to sections
5. Test lazy loading performance

### Code Quality
- ESLint for code quality enforcement
- TypeScript for type safety
- Proper component structure and naming conventions

## Deployment

### Netlify Configuration
The project is configured for Netlify deployment with:
- Automatic build process using `npm run build`
- Production optimization settings
- Proper environment handling

### Build Process
```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

## Common Development Tasks

### Adding New Pages
1. Create a new component in `src/pages/`
2. Import and add route in `src/App.jsx`
3. Add navigation link in `Navbar.jsx` if needed

### Modifying Navigation
Update the `navLinks` array in `Navbar.jsx` to modify menu items.

### Customizing Styling
Use Tailwind CSS utility classes directly in components or modify global styles in `index.css`.

## Troubleshooting

### Common Issues
1. **Lazy loading not working**: Ensure proper Suspense usage and check component imports
2. **Navigation issues**: Verify route paths and React Router configuration
3. **Responsive problems**: Check Tailwind breakpoints and mobile-first approach
4. **Performance issues**: Monitor bundle sizes and optimize chunking

### Debugging Tips
- Use browser developer tools to inspect components
- Check console for error messages
- Validate component structure and props
- Test on multiple devices/browsers

## Best Practices

1. **Component Structure**: Keep components small and focused
2. **Performance**: Continue using lazy loading where appropriate
3. **Accessibility**: Ensure proper ARIA attributes and semantic HTML
4. **Responsive Design**: Always test on mobile devices
5. **Code Quality**: Follow existing code patterns and conventions
6. **Type Safety**: Leverage TypeScript for better development experience

## Version Control

### Branching Strategy
- `main` branch contains production-ready code
- Feature branches for new developments
- Pull requests for code review

### Commit Messages
Follow conventional commit format:
```
feat: add new navigation item
fix: resolve mobile menu issue
docs: update developer guide
```

This guide should help developers understand and contribute to the KMSF website project effectively.