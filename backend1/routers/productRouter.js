import express from "express";
import { isAdminAuth } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct, } from "../controllers/productController.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
app.post("/new",  newProduct);
app.get("/all", getAllProducts);
app.get("/latest", getLatestProducts);
app.get("/categories", getAllCategories);
app.get("/admin-products", getAdminProducts);
app
    .route("/:id")
    .get(getSingleProduct)
    .put(isAdminAuth, singleUpload.single("photo"), updateProduct)
    .delete(isAdminAuth, deleteProduct);
export default app;
