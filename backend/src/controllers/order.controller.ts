import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types';

import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from '../services/order.service';

export const createNewOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { products, totalAmount } = req.body;

    if (!products || !products.length || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Products and total amount are required',
      });
    }

    const newOrder = await createOrder({
      userId: req.user.uid,
      products,
      totalAmount,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const orders = await getOrdersByUserId(req.user.uid);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { id } = req.params;

    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if the order belongs to the user
    if (order.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
