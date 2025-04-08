import express from "express";
import { isAdminAuth } from "../middlewares/auth.js";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/productController.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

// Create New Product - /api/v1/meds/new
app.post("/new", isAdminAuth, singleUpload.single("photo"), newProduct);

// To get poducts with filters - /api/v1/meds/all
app.get("/all", getAllProducts);

// Create New Product - /api/v1/meds/latest
app.get("/latest", getLatestProducts);

// Create New Product - /api/v1/meds/categories
app.get("/categories", getAllCategories);

// Create New Product - /api/v1/meds/admin-products
app.get("/admin-products", isAdminAuth, getAdminProducts);

// To get, update, delete product
app
  .route("/:id")
  .get(getSingleProduct)
  .put(isAdminAuth, singleUpload.single("photo"), updateProduct)
  .delete(isAdminAuth, deleteProduct);

export default app;
