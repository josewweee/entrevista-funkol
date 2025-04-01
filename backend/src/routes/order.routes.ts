import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

import {
  createNewOrder,
  getOrderDetails,
  getUserOrders,
} from '../controllers/order.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - name
 *         - price
 *       properties:
 *         productId:
 *           type: string
 *           description: ID of the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *     Order:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - products
 *         - totalAmount
 *         - createdAt
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the order
 *         userId:
 *           type: string
 *           description: ID of the user who placed the order
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *           description: Total amount of the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date the order was created
 *         status:
 *           type: string
 *           description: Status of the order
 *           enum: [pending, completed, cancelled]
 *     NewOrder:
 *       type: object
 *       required:
 *         - products
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 */

// All order routes require authentication
router.use(authMiddleware as any);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product to order
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', createNewOrder as any);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', getUserOrders as any);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getOrderDetails as any);

export const orderRoutes = router;
