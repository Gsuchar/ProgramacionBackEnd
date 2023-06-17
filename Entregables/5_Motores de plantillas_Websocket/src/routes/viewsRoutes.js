import express from "express";
import { ProductManager } from "../ProductManager.js";
export const viewsRoutes = express.Router();

const productManager = new ProductManager('./src/dataFiles/products.json');

//VISTA WEBSOCKET PRODUCTOS
viewsRoutes.get("/realtimeproducts", async (req, res) => {  
  try {
    const products = await productManager.getProducts(); 
    res.status(200).render('realtimeproducts', { products});
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});

export default viewsRoutes;
