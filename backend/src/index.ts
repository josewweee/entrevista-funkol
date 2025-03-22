import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import './config/firebase.config';
import { specs } from './config/swagger.config';
import { errorMiddleware } from './middleware/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { orderRoutes } from './routes/order.routes';
import { productRoutes } from './routes/product.routes';
import { userRoutes } from './routes/user.routes';

//-------------------------------
// Environment Setup
//-------------------------------

// Load environment variables
dotenv.config();

// Server configuration
const app = express();
const PORT = process.env.PORT || 3000;

//-------------------------------
// Middleware Configuration
//-------------------------------

// Body parsing, CORS, and logging
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//-------------------------------
// API Routes
//-------------------------------

// API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Funkol API is running!');
});

//-------------------------------
// Error Handling
//-------------------------------

// Global error handler
app.use(errorMiddleware);

//-------------------------------
// Server Initialization
//-------------------------------

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
