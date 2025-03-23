# Funkol E-Commerce Platform

A modern e-commerce application for browsing and purchasing products from top tech brands including Google, Apple, and Samsung.

## Project Overview

Funkol is a full-stack e-commerce platform that provides users with a seamless shopping experience. It includes features like Google SSO authentication, product browsing by brand, detailed product views, order management, and a secure checkout process.

## Architecture

The project is built using a modern client-server architecture:

### Frontend

- Ionic/Angular SPA
- Responsive design for mobile and desktop
- Firebase hosting

### Backend

- Node.js/Express.js with TypeScript
- Firebase Authentication
- Firestore Database
- JWT for API security
- Google Cloud Run deployment

## Project Structure

```
├── front-end/         # Ionic/Angular frontend application
├── backend/           # Node.js/Express.js backend API
└── user-stories.txt   # Product requirements and user stories
```

## Getting Started

1. Clone this repository
2. Set up the frontend:
   ```
   cd front-end
   pnpm install
   pnpm start
   ```
3. Set up the backend:
   ```
   cd backend
   pnpm install
   pnpm run dev
   ```

## Documentation

For more detailed information:

- [Frontend Documentation](./front-end/README.md)
- [Backend Documentation](./backend/README.md)
