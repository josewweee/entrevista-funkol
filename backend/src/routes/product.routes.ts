import { Router } from 'express';
import { getProduct, getProducts } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - brand
 *         - price
 *         - description
 *         - imageUrl
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         brand:
 *           type: string
 *           description: The brand of the product
 *           enum: [Google, Apple, Samsung]
 *         price:
 *           type: number
 *           description: The price of the product
 *         description:
 *           type: string
 *           description: Product description
 *         imageUrl:
 *           type: string
 *           description: URL to the product image
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the product was last updated
 */

// All order routes require authentication
router.use(authMiddleware as any);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter products by brand
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', getProducts as any);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a specific product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getProduct as any);

export const productRoutes = router;
