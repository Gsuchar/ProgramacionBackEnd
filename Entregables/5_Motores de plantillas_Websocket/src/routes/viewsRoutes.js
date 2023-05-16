//import express from "express";
//import { ProductManager } from "../ProductManager.js";
//import { Router } from 'express';
//const viewsRoutes = Router();
//const productManager = new ProductManager('./src/dataFiles/products.json');

import express from "express";
export const viewsRoutes = express.Router();

//VISTA WEBSOCKET
viewsRoutes.get("/realtimeproducts", async (req, res) => {  
  try {
    //const products = await productManager.getProducts();    
    res.status(200).render("realtimeproducts", { });
    //res.status(200).render("realtimeproducts", { });

  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});

export default viewsRoutes;
