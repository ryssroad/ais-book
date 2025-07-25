# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React web application called "gpt-book" that displays a blog-style interface for a book titled "Логика на жаре" (Logic in the Heat). The project is a literary work presented as a chronicle/memoir in log format, featuring chapters about AI, consciousness, and technological exploration in a dystopian setting.

## Development Commands

### Essential Commands
- `npm start` - Runs the development server on http://localhost:3000
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production to the `build` folder
- `npm run eject` - One-way operation to expose Create React App configuration (use with caution)

### Installation
- `npm install` - Install all dependencies

## Architecture and Code Structure

### Core Application Structure
The application follows a standard Create React App structure with these key components:

**Main App Component (`src/App.js`)**:
- Single-page application with hash-based routing
- Uses Radix UI Themes for consistent design system
- Dark theme with cyan accent color
- Manages navigation between post list and individual post views

**Data Structure**:
- All blog content is stored as an array of post objects in `src/App.js`
- Each post contains: `id`, `title`, `date`, and a `content` function that returns JSX
- Posts are sorted by ID and represent book chapters

**Key Components**:
- `App()` - Main application with routing logic
- `PostList()` - Displays all posts in a grid layout
- `PostView()` - Shows individual post content with navigation

### Design System
- **UI Library**: Radix UI Themes (@radix-ui/themes)
- **Theme**: Dark mode with cyan accents and slate gray
- **Typography**: Serif font for content, system fonts for UI
- **Layout**: Responsive design with max-width containers

### State Management
- Uses React's built-in `useState` and `useEffect` hooks
- Hash-based routing for deep linking to specific posts
- No external state management library

### Content Management
All blog content is embedded directly in the JavaScript as JSX components. Content includes:
- Russian text (the book is written in Russian)
- Code blocks using Radix UI `Code` component
- Styled cards for quotes and special sections
- Tables for data presentation
- Mixed narrative and technical documentation style

## Development Guidelines

### When Working with Content
- All text content is in Russian - preserve the language and meaning
- Content uses a mix of literary narrative and technical log formats
- Code blocks and technical sections should maintain their formatting
- Preserve the thematic elements (colors, styling) that support the narrative

### Code Style Conventions
- Uses modern React functional components with hooks
- Consistent use of Radix UI components
- Responsive design patterns with `initial` and `md` breakpoints
- Component organization: main component, then helper components
- Comments in both English and Russian for context

### UI/UX Patterns
- Hash-based routing for post navigation
- Hover effects on interactive elements
- Consistent spacing using Radix UI spacing system
- Card-based layout for content sections
- Mobile-responsive design

### Testing
- Uses React Testing Library (@testing-library/react, @testing-library/jest-dom)
- Tests are configured through Create React App's built-in Jest setup
- Run tests with `npm test`

## Dependencies

### Core Dependencies
- **React 19.1.0** - Main framework
- **@radix-ui/themes 3.2.1** - Design system and UI components
- **react-scripts 5.0.1** - Create React App build tools

### Testing Dependencies
- **@testing-library/react** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **@testing-library/user-event** - User interaction simulation

## Performance Considerations
- All content is loaded at once (no lazy loading currently implemented)
- Uses React.StrictMode for development warnings
- Web Vitals monitoring included via `reportWebVitals`
- Hash routing avoids server-side routing complexity

## Deployment Notes
- Built with Create React App, standard deployment practices apply
- Static site suitable for GitHub Pages, Netlify, Vercel, etc.
- No backend dependencies or API calls
- All assets are bundled and optimized during build process