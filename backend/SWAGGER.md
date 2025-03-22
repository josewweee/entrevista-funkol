# Swagger API Documentation

This project uses Swagger for API documentation. Swagger provides a user-friendly interface to explore and test the API endpoints.

## Accessing the Documentation

The Swagger documentation is available at the `/api-docs` endpoint when the server is running.

- Development: http://localhost:3000/api-docs
- Production: https://your-deployed-app.com/api-docs

## Features

The Swagger documentation includes:

- Detailed information about all API endpoints
- Request and response schemas
- Authentication requirements
- Example requests and responses
- Interactive API testing

## Available API Endpoints

The API is organized into the following sections:

1. **Authentication**

   - Google Sign-In

2. **Users**

   - Get current user profile

3. **Products**

   - Get all products (with optional filtering)
   - Get product details

4. **Orders**
   - Create a new order
   - Get all user orders
   - Get order details

## Authentication

Most API endpoints require authentication. The API uses JWT Bearer tokens for authentication.

To authenticate:

1. Use the Google Sign-In endpoint to obtain a JWT token
2. Include the token in the Authorization header of your requests:
   `Authorization: Bearer YOUR_JWT_TOKEN`

## Using the Swagger UI

1. Navigate to the Swagger documentation URL
2. Authenticate using the "Authorize" button at the top of the page
3. Enter your JWT token
4. Explore the API endpoints
5. Try out requests directly from the Swagger UI

## Development

If you add new endpoints or modify existing ones, make sure to update the Swagger documentation. The documentation is generated from JSDoc comments in the route files.

Example of documenting an endpoint:

```typescript
/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Brief description
 *     tags: [CategoryName]
 *     parameters:
 *       - name: paramName
 *         in: query
 *         schema:
 *           type: string
 *         description: Param description
 *     responses:
 *       200:
 *         description: Success response
 */
```
