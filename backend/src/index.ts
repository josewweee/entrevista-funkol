import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import './config/firebase.config';
import { errorMiddleware } from './middleware/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { orderRoutes } from './routes/order.routes';
import { productRoutes } from './routes/product.routes';
import { userRoutes } from './routes/user.routes';



// Initialize Firebase Admin SDK

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Funkol API is running!');
});

// Error middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
