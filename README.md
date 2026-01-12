# UTS DPM - Driver Performance Management System

A modern Angular web application for managing driver performance metrics at the University of Virginia Transit Service (UTS).

## Overview

UTS DPM is a Driver Performance Management system that tracks individual driver actions (both positive and negative) called "DPMs". The system manages these records across different user roles, from drivers who can view their own records to administrators who have full system access.

**What is a DPM?** A DPM (Driver Performance Marker) is a single action that a driver takes that should be noted - such as being late, picking up a block (shift), passing a safety inspection, or other performance indicators. Each DPM type has an associated point value that contributes to the driver's overall performance score.

## Tech Stack

### Frontend
- **Framework:** Angular 21.0.8 (standalone components)
- **UI Libraries:**
  - PrimeNG 21.0.2 (tables, date pickers, autocomplete)
  - DaisyUI 5.0.35 (Tailwind component library)
  - Tailwind CSS 4.1.6 (utility-first styling)
- **State Management:** Angular Signals + RxJS
- **Language:** TypeScript 5.9
- **Build Tool:** Angular CLI 21.0.5

### Backend
- **API:** Spring Boot ([separate repository](https://github.com/airfork/uts-dpm/tree/rewrite))
- **Hosting:** Heroku
- **Authentication:** JWT tokens

### Deployment
- **Frontend Hosting:** Firebase Hosting
- **CI/CD:** GitHub Actions

## Key Concepts

### User Roles

The system has 5 distinct roles with increasing levels of access:

1. **DRIVER** - Can only view their own DPMs
2. **ANALYST** - Can create DPMs and use autogeneration features
3. **SUPERVISOR** - Can create DPMs and use autogeneration
4. **MANAGER** - Can create, approve DPMs, and use autogeneration
5. **ADMIN** - Full system access including user management and DPM type configuration

### DPM Types & Points System

- DPM types are organized into **groups** (e.g., safety violations, performance issues)
- Each type has a configurable **point value** (-100 to +100)
- Points can be **positive** (rewards) or **negative** (penalties)
- Users accumulate points based on approved DPMs
- Types can have optional **color coding** for visual categorization

### DPM Lifecycle

1. **Creation** - Admin/Analyst/Manager/Supervisor creates a DPM for a driver
2. **Pending** - DPM awaits approval
3. **Approval** - Admin/Manager reviews and either:
   - **Approves** - DPM is assigned to user, points added to their balance
   - **Denies** - DPM is marked as ignored
4. **Points can be edited** during the approval process

## Project Structure

```
src/
├── app/
│   ├── auth/              # Authentication (login, password change)
│   ├── dpms/              # DPM management features
│   │   ├── home/          # View own DPMs
│   │   ├── dpm-page/      # Create/Edit DPMs
│   │   ├── new-dpm/       # New DPM form
│   │   ├── edit-dpms/     # Edit DPM types (admin)
│   │   ├── autogen/       # Auto-generate DPMs
│   │   └── approvals/     # Approve/deny DPMs
│   ├── users/             # User management (admin)
│   ├── error-pages/       # 404, 403 error pages
│   ├── ui/                # Shared UI components
│   │   ├── navbar/        # Navigation
│   │   └── confirm-box/   # Confirmation dialogs
│   ├── shared/            # Shared utilities
│   │   ├── pipes/         # Custom pipes (PointsPipe, BlockPipe, NamePipe)
│   │   └── loading/       # Loading component
│   ├── services/          # Business logic services (9 services)
│   └── models/            # TypeScript interfaces/DTOs (21 models)
├── assets/                # Static assets
├── environments/          # Environment configs
└── styles/                # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js 22 (LTS recommended)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:airfork/uts-dpm-frontend.git
   cd uts-dpm-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

   Note: `--legacy-peer-deps` is required due to ngx-toastr being on v19 while Angular is on v21.

3. **Environment Configuration**

   Update `src/environments/environment.ts` and `environment.prod.ts` with your backend API URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://your-backend-api.herokuapp.com'
   };
   ```

4. **Run development server**
   ```bash
   npm start
   ```

   Navigate to `http://localhost:4200/`

5. **Build for production**
   ```bash
   npm run build:prod
   ```

   Build artifacts will be in `dist/uts-dpm/`

## Development Workflow

### Available Scripts

```bash
npm start              # Start dev server (ng serve)
npm run build          # Build for development
npm run build:prod     # Build for production
npm run watch          # Build with watch mode
npm test               # Run unit tests
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
```

### Code Style

- **ESLint** enforces code quality
- **Prettier** handles formatting
- Use Angular's standalone component pattern
- Prefer signals over observables for reactive state
- Use `inject()` for dependency injection

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Commit with descriptive messages
4. Push and create a Pull Request
5. PR is auto-deployed to Firebase preview environment (when enabled)
6. After approval, merge to `main` for production deployment

## Architecture

### Component Architecture

This app uses Angular 21's **standalone components** (no NgModules):
- Components declare their own imports
- Routes lazy-load features
- Services are singleton via `providedIn: 'root'`

### State Management

- **Services** act as state holders (e.g., AuthService stores user data)
- **Signals** for reactive local component state
- **RxJS Observables** for async operations (HTTP, streams)
- **LocalStorage** for session persistence (JWT token, user role)

### Authentication Flow

1. User enters credentials on `/login`
2. Backend returns JWT token
3. Token is decoded and stored in localStorage
4. `AuthService` maintains UserData object
5. `authGuard` protects routes based on role
6. HTTP interceptor handles 401/403 responses

### API Integration

- **Services** handle all API calls
- Base URL configured in environment files
- JWT token sent in Authorization header
- Responses are typed with DTOs
- Error handling via `ErrorService`

## Deployment

### Firebase Hosting

The app is automatically deployed to Firebase Hosting:

- **Production:** Push to `main` branch triggers deployment
- **Preview:** Pull requests can create preview deployments (currently disabled due to staging environment costs)

### Deployment Process

1. GitHub Actions workflow triggers on push to `main`
2. Installs dependencies with `npm ci --legacy-peer-deps`
3. Builds production bundle with `npm run build:prod`
4. Deploys to Firebase Hosting
5. Site is live at your configured Firebase domain

### Manual Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
npm run build:prod
firebase deploy --only hosting
```

## Testing

### Unit Tests (Karma + Jasmine)

```bash
npm test                    # Run in watch mode
```

Tests are located alongside their corresponding components and services.

## Common Workflows

### Creating a DPM (Admin/Analyst/Manager/Supervisor)

1. Navigate to `/dpm` (or click "DPM" in navbar)
2. Fill out the form:
   - Driver name (autocomplete)
   - Block name
   - Location
   - Date
   - Start/End time
   - DPM type (from dropdown)
   - Notes (optional)
3. Click Submit
4. DPM enters pending approval state

### Approving DPMs (Admin/Manager)

1. Navigate to `/approvals`
2. View table of pending DPMs
3. Click a row to open detail modal
4. Optionally edit the point value
5. Click "Approve" or "Deny"

### Editing DPM Types (Admin Only)

1. Navigate to `/dpm`, click "Edit" tab
2. Drag-and-drop to reorder groups or move types between groups
3. Add new groups or types with the + button
4. Edit names, point values, or assign colors
5. Click "Save" when done

### Managing Users (Admin Only)

1. Navigate to `/users`
2. View list of all users
3. Click a user to see details and their DPM history
4. Create new users with the form
5. Edit or delete existing users

## Troubleshooting

### Common Issues

**Dev server fails to start:**
- Ensure Node.js 22 is installed
- Delete `node_modules` and run `npm install --legacy-peer-deps` again

**Build fails with peer dependency errors:**
- Use `--legacy-peer-deps` flag
- Ensure you're using compatible versions (see package.json)

**Can't login:**
- Check that backend API URL is correct in environment files
- Verify backend is running and accessible
- Check browser console for error messages

**Changes not appearing:**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Clear browser cache
- Check that dev server recompiled (watch for "Build succeeded" message)

## Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md) - Detailed technical architecture
- [Contributing Guide](./docs/CONTRIBUTING.md) - How to contribute to the project
- [AI Agent Context](./docs/claude.md) - Context file for AI coding assistants

## Project History

- **2018** - Original version built with Go and custom CSS
- **Late 2022** - Refactored to Angular with separate frontend/backend
- **Early 2024** - Made DPM types editable (previously hardcoded)
- **January 2026** - Upgraded to Angular 21, modernized dev workflow

## License

Private - University of Virginia Transit Service

## Contact

For questions or issues, contact the maintainer (formerly UTS supervisor, now maintains as volunteer).

---

**Last Updated:** January 2026
**Angular Version:** 21.0.8
**Node Version:** 22 (LTS)
