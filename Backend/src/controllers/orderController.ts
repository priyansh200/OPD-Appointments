import { Request } from "express";

import { NewOrderRequestBody, OrderItemType } from "../types/types.js";
import { Order } from "../models/orderSchema.js";

import { TryCatch } from "../middlewares/tryCatch.js";
import { ErrorHandler } from "../middlewares/error.js";
import { Product } from "../models/productSchema.js";

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};

export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;

  let orders = await Order.find({ user });

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const allOrders = TryCatch(async (req, res, next) => {
  let orders = await Order.find().populate("user", "name");

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let order = await Order.findById(id).populate("user", "name");
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  return res.status(200).json({
    success: true,
    order,
  });
});

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
      return next(new ErrorHandler("Please Enter All Fields", 400));

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      total,
    });

    await reduceStock(orderItems);

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
    });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  switch (order.status) {
    case "Processing": {
      order.status = "Shipping";
      break;
    }
    case "Shipping": {
      order.status = "Delivered";
      break;
    }
    default: {
      order.status = "Delivered";
      break;
    }
  }

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  await order.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
