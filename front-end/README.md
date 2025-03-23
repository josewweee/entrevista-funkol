# Funkol Frontend

Frontend for the Funkol e-commerce application built with Ionic/Angular.

## Features

- Google Authentication
- Product Catalog with Filtering by Brand
- Product Detail Pages
- Shopping Cart
- Order History
- Responsive Design for Mobile and Desktop

## Tech Stack

- Ionic Framework
- Angular 19
- TypeScript
- RxJS for State Management
- Firebase Hosting
- Firebase Authentication

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── services/         # Services for API and state management
│   │   ├── models/           # TypeScript interfaces
│   │   ├── guards/           # Route guards
│   │   └── shared/           # Shared modules and utilities
│   ├── assets/               # Static assets
│   ├── environments/         # Environment configuration
│   └── theme/                # Global styles and theming
├── www/                      # Build output
├── resources/                # App icons and splash screens
├── config.xml                # Ionic configuration
└── angular.json              # Angular workspace configuration
```

## Setup Instructions

1. Install dependencies

   ```
   pnpm install
   ```

2. Start the development server

   ```
   pnpm start
   ```

3. Build for production
   ```
   pnpm run build:prod
   ```

## Deployment

The frontend is deployed to Firebase Hosting. To deploy:

```
pnpm run deploy
```

For CI/CD pipeline deployment:

```
pnpm run deploy:ci
```

## Development Guidelines

- Follow Angular best practices
- Use Ionic components for UI elements
- Maintain responsive design for all screen sizes
- Use lazy loading for feature modules
