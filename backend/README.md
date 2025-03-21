# Funkol Backend

Backend for the Funkol e-commerce application that allows users to explore and buy products from Google, Apple, and Samsung.

## Features

- Google SSO Authentication
- User Management
- Product Listing and Filtering by Brand
- Product Details
- Order Creation and History
- JWT Authentication for API Endpoints

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Firebase Authentication
- Firestore Database
- JWT for API Protection

## Project Structure

```
├── src/
│   ├── config/
│   │   └── firebase.config.ts     // Firebase configuration
│   ├── controllers/
│   │   ├── auth.controller.ts     // Authentication logic
│   │   ├── product.controller.ts  // Product management
│   │   ├── user.controller.ts     // User management
│   │   └── order.controller.ts    // Order management
│   ├── middleware/
│   │   ├── auth.middleware.ts     // JWT authentication
│   │   └── error.middleware.ts    // Error handling
│   ├── routes/
│   │   ├── auth.routes.ts         // Authentication routes
│   │   ├── product.routes.ts      // Product routes
│   │   ├── user.routes.ts         // User routes
│   │   └── order.routes.ts        // Order routes
│   ├── services/
│   │   ├── auth.service.ts        // Authentication business logic
│   │   ├── product.service.ts     // Product business logic
│   │   ├── user.service.ts        // User business logic
│   │   └── order.service.ts       // Order business logic
│   ├── types/
│   │   └── index.ts               // TypeScript interfaces
│   └── index.ts                   // Entry point
├── .env                           // Environment variables (not committed)
├── .env.example                   // Example environment variables
├── package.json
└── tsconfig.json
```

## Setup Instructions

1. Clone the repository
2. Install dependencies
   ```
   pnpm install
   ```
3. Copy `.env.example` to `.env` and fill in the required environment variables
   ```
   cp .env.example .env
   ```
4. Start the development server
   ```
   pnpm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/google` - Google Sign-In

### Users

- `GET /api/users/me` - Get current user

### Products

- `GET /api/products` - Get all products
- `GET /api/products?brand=Apple` - Filter products by brand
- `GET /api/products/:id` - Get a specific product

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get a specific order

## Deployment

This backend is designed to be deployed to Google Cloud Run. For deployment instructions, refer to the Google Cloud Run documentation.
