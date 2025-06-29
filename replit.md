# replit.md

## Overview

PawConnect is a modern pet adoption platform built as a full-stack web application. It connects potential pet owners with shelter animals through an intuitive mobile-first interface. The application features pet browsing, favorites management, adoption applications, and user authentication through Replit's authentication system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for brand consistency
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple

### Mobile-First Design
- Responsive design optimized for mobile devices
- Bottom navigation pattern for mobile UX
- Touch-friendly interface elements
- Progressive Web App capabilities

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OIDC
- **Session Management**: Server-side sessions stored in PostgreSQL
- **User Management**: Automatic user creation and profile management
- **Security**: HTTP-only cookies with secure flags

### Database Schema
- **Users**: Profile information linked to Replit accounts
- **Pets**: Comprehensive pet data including images, characteristics, and status
- **Shelters**: Shelter information and contact details
- **Favorites**: User-pet relationship tracking
- **Applications**: Adoption application submissions
- **Sessions**: Secure session storage

### API Routes
- **Authentication**: `/api/auth/*` - User authentication and profile management
- **Pets**: `/api/pets/*` - Pet browsing, filtering, and detailed views
- **Favorites**: `/api/favorites/*` - User favorites management
- **Applications**: `/api/applications/*` - Adoption application handling
- **Shelters**: `/api/shelters/*` - Shelter information

### Frontend Pages
- **Landing**: Unauthenticated welcome page with login prompt
- **Home**: Main pet browsing interface with search and filters
- **Favorites**: User's saved pets
- **Applications**: Application status tracking
- **Pet Details**: Modal-based detailed pet information

## Data Flow

### Authentication Flow
1. User clicks login on landing page
2. Redirected to Replit OIDC provider
3. Upon success, user profile created/updated in database
4. Session established with secure cookies
5. User redirected to main application

### Pet Discovery Flow
1. User browses pets on home page
2. Search and filter parameters sent to backend API
3. Database queried with filtering logic
4. Results returned with pagination support
5. Pet cards rendered with favorite status

### Favorites Management
1. User clicks heart icon on pet card
2. API call made to toggle favorite status
3. Database updated with user-pet relationship
4. UI updated optimistically with animation feedback
5. Query cache invalidated for consistency

### Application Submission
1. User views pet details and clicks apply
2. Application form modal presented
3. Form data validated and submitted to API
4. Application record created in database
5. Confirmation shown to user

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **express**: Web server framework
- **passport**: Authentication middleware

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database schema management

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Process**: Concurrent TypeScript compilation and Vite dev server
- **Hot Reloading**: Enabled for both frontend and backend changes
- **Error Handling**: Runtime error overlay for debugging

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild compiles TypeScript server to `dist/index.js`
- **Assets**: Static files served from build directory
- **Environment**: Production environment variables required

### Database Management
- **Migrations**: Drizzle Kit manages schema changes
- **Connection**: Neon PostgreSQL serverless database
- **Schema**: Shared schema definitions between frontend and backend

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit application identifier
- `ISSUER_URL`: OIDC provider URL (defaults to Replit)

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```