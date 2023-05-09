import { Router } from 'express';
import { ProductManager } from "../ProductManager.js";
const routerProd = Router();
const productManager = new ProductManager('./src/dataFiles/products.json');

// TRAIGO TODOS LOS PRODUCTOS (en caso de tener límite, trae solo la cantidad indicada)
routerProd.get('/api/products', async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await productManager.getProducts();
    if (limit) {
      res.status(200).json(products.slice(0, limit));
    } else {
      res.status(200).json(products);
    };
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  };
});

// TRAIGO PRODUCTO SEGÚN EL ID INDICADO EN URL
routerProd.get('/api/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.getProductById(pid);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: `No se encontró el producto con ID ${pid}.` });
  };
});

// MODIFICA UN PRODUCTO EXISTENTE SEGÚN ID Y CAMPO A MODIFICAR
routerProd.put('/api/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  const fieldsToUpdate = req.body;
  try {
    const product = await productManager.updateProduct(pid, fieldsToUpdate);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: `${err}` });
  };
});

// AGREGO PRODUCTO
routerProd.post('/api/products', async (req, res) => {
  try {
    const product = await productManager.addProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: `${err}` });
  };
});

// BORRO PRODUCTO SEGÚN ID INDICADO
routerProd.post('/api/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.deleteProduct(pid);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: `${err}` });
  };
});

export default routerProd;
