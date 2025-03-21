import { NextFunction, Request, Response } from 'express';

import {
  getAllProducts,
  getProductById,
  getProductsByBrand,
} from '../services/product.service';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { brand } = req.query;
    let products;

    if (brand) {
      products = await getProductsByBrand(brand as string);
    } else {
      products = await getAllProducts();
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
