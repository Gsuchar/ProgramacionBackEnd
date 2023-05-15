import { Router } from 'express';
import { ProductManager } from "../ProductManager.js";
import { uploader } from '../utils.js';
import path from 'path';

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
    res.status(500).json({ Error: `${err}` });
  };
});

// TRAIGO PRODUCTO SEGÚN EL ID INDICADO EN URL
routerProd.get('/api/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.getProductById(pid);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ Error: `No se encontró el producto con ID ${pid}.` });
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
    res.status(404).json({ Error: `${err}` });
  };
});

// AGREGO PRODUCTO
routerProd.post('/api/products', async (req, res) => {
  try {       
    const product = await productManager.addProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ Error: `${err}` });
  };
});

// BORRO PRODUCTO SEGÚN ID INDICADO
routerProd.post('/api/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.deleteProduct(pid);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ Error: `${err}` });
  };
});

//--------DESAFIO 5----------//
//AGREGA PROD X data-form
routerProd.post('/html/products', uploader.single('file'), async (req, res) => {
  try {
    const productData = {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    };    
    const product = await productManager.addProduct(productData, req.file);
    res.status(201).json(product);
  }catch (err) {
    res.status(400).json({ Error: `${err}` });
  }
});

routerProd.get("/html/products", (req, res) => {
  return res.status(200).json({
    status: "success",
    msg: "listado de usuarios",
    data: products,
  });
});

export default routerProd;
