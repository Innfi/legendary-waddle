# Code Organization

## Project Overview
This is a React + TypeScript application built with Vite, using Material UI for components and React Query for data fetching.

## Directory Structure

### `/src`
Main application source code.

#### `/src/components`
Reusable UI components and utilities.

- **`Button.tsx`** - Custom button component
- **`CustomsIcons.tsx`** - Icon components
- **`ErrorBoundary.tsx`** - Error boundary wrapper for React error handling
- **`utils.ts`** - Utility functions for components

##### `/src/components/api`
API client configuration and query setup.

- **`axios.client.ts`** - Axios instance configuration with interceptors
- **`query.client.ts`** - React Query client setup

##### `/src/components/auth`
Authentication-related components and logic.

- **`api.ts`** - Authentication API calls
- **`private.page.tsx`** - Protected route wrapper component

##### `/src/components/notification`
Notification system using React Context.

- **`NotificationContext.ts`** - Context definition
- **`NotificationProvider.tsx`** - Provider component
- **`useNotification.ts`** - Hook for accessing notifications

#### `/src/pages`
Page components representing different routes.

- **`api.ts`** - API calls specific to pages
- **`DashboardPage.tsx`** - Main dashboard view
- **`Footer.tsx`** - Footer component
- **`LandingPage.tsx`** - Landing/home page
- **`WorkoutDetailCard.tsx`** - Card component for workout details
- **`WorkoutHistorySubmitV2.tsx`** - Form for submitting workout history (refactored version using Jotai atoms)
- **`WorkoutPage.tsx`** - Workout listing/management page

##### `/src/pages/components`
Reusable components specific to page functionality.

- **`WorkoutCard.tsx`** - Card component for displaying and editing a single workout (name, memo, records)
- **`WorkoutRecordInput.tsx`** - Input component for a single workout set (weight, reps, sets)

##### `/src/pages/functions`
Utility functions used by pages.

- **`calculate-averages.ts`** - Functions for calculating workout statistics

#### `/src/state`
State management using Jotai atoms.

- **`atom.ts`** - Global state atoms
- **`entity.ts`** - Entity-related state
- **`locals.ts`** - Local state definitions

#### `/src/theme`
Material UI theme customization.

- **`AppTheme.tsx`** - Theme provider component
- **`color-schemes.ts`** - Color palette definitions
- **`design-tokens.ts`** - Design system tokens
- **`primitives.ts`** - Primitive theme values
- **`typography.ts`** - Typography settings

##### `/src/theme/customizations`
Component-specific theme overrides.

- **`data-display.tsx`** - Data display component styles
- **`feedback.tsx`** - Feedback component styles
- **`inputs.tsx`** - Input component styles
- **`navigation.tsx`** - Navigation component styles
- **`surfaces.ts`** - Surface component styles

#### `/src/utils`
Application-wide utility functions.

- **`logger.ts`** - Logging utility

### Root Files

- **`App.tsx`** - Main application component
- **`main.tsx`** - Application entry point
- **`router.tsx`** - React Router configuration
- **`index.css`** - Global styles
- **`App.css`** - App component styles

## Key Patterns

### API Layer
- Axios client is configured in `src/components/api/axios.client.ts`
- React Query is set up in `src/components/api/query.client.ts`
- API endpoints are defined in domain-specific `api.ts` files (auth, pages)

### State Management
- Global state uses Jotai atoms (in `/src/state`)
- React Query for server state
- Context API for cross-cutting concerns (notifications)

### Routing
- Routes are defined in `src/router.tsx`
- Protected routes use `PrivatePage` wrapper from `src/components/auth/private.page.tsx`

### Theming
- Material UI theme is customized in `/src/theme`
- Component-level overrides in `/src/theme/customizations`
- Design tokens provide consistent spacing, colors, and typography

### Component Organization
- Reusable components in `/src/components`
- Page-level components in `/src/pages`
- Domain-specific logic colocated with components

## Data Flow

1. **User Interaction** → Component
2. **Component** → React Query hook (using API client)
3. **API Client** → Backend (via Axios)
4. **Response** → React Query cache → Component
5. **Global State** → Jotai atoms (for client-side state)

## Authentication Flow

1. Auth API (`src/components/auth/api.ts`) handles login/logout
2. Axios interceptors add auth headers
3. `PrivatePage` component protects routes
4. Redirect to login if unauthorized

## Notification System

- `NotificationProvider` wraps the app
- Components use `useNotification` hook
- Centralized notification display and management

## Build Configuration

- **Vite** - Build tool and dev server (`vite.config.ts`)
- **TypeScript** - Type checking (`tsconfig.*.json`)
- **Tailwind CSS** - Utility-first styling (`tailwind.config.js`)
- **PostCSS** - CSS processing (`postcss.config.js`)
- **ESLint** - Code linting (`eslint.config.js`)
