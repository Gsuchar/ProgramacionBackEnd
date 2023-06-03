import { Router } from 'express';
import { ProductManager } from "../dao/ProductManager.js";
import { uploader } from '../utils.js';
import {ProductService} from "../services/productService.js"


const routerProd = Router();
const productManager = new ProductManager('./src/dao/dataFiles/products.json');
const productService = new ProductService;

//-------ROUTER MONGO----------//
// TRAIGO TODOS LOS PRODUCTOS (en caso de tener límite, trae solo la cantidad indicada)
// TODOS > http://localhost:8080/mongo-products
// Limite 2 > http://localhost:8080/mongo-products?limit=2 
routerProd.get("/mongo-products", async (req, res) => {  
  try {
    const limit = req.query.limit;
    const products = await productService.getProducts(limit); 
    res.status(200).json( { products : products });
  } catch (err) {
      res.status(500).json({ Error: `${err}` });
    }
});

// TRAIGO PRODUCTO SEGÚN EL ID INDICADO EN URL
routerProd.get('/mongo-products/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productService.getProductById(pid);
    res.status(200).json(product);
  } catch (err) {
      res.status(404).json({ Error: `No se encontró el producto con ID ${pid}.` });
  };
});
// PRODUCTO NUEVO
routerProd.post("/mongo-products-new", async (req, res) => {
  try {
    const { title, description, price, code, stock, category, thumbnail } = req.body.products;
    const prodToCreate = await productService.addProduct({ title, description,  code, price, status: true, stock, category, thumbnail });    
    return res.status(201).json({ products: prodToCreate });
  } catch (err) {
      res.status(500).json({ Error: `${err}` });
  }
});

// MODIFICA UN PRODUCTO EXISTENTE SEGÚN ID Y CAMPO A MODIFICAR
routerProd.put("/mongo-products-update/:pid", async (req, res) => {
  const { pid } = req.params;
  const fieldsToUpdate = req.body.products;
  try {
    const product = await productService.updateProduct(pid, fieldsToUpdate);
    res.status(200).json(product);
  } catch (err) {
      res.status(500).json({ Error: `${err}` });
  }
});

// DELETE PRODUCTO
routerProd.delete("/mongo-products-delete/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted =  await productService.deleteProduct(pid)
    return res.status(200).json(deleted);
  }catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});

//-------FIN ROUTER MONGO----------//
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//*********************ANTERIOR FILESYSTEM*********************//
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//--------------ROUTER API--------------/
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

// PRODUCTO NUEVO
routerProd.post('/api/products', async (req, res) => {
  try {       
    const product = await productManager.addProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ Error: `${err}` });
  };
});

// DELETE PRODUCTO
routerProd.post('/api/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.deleteProduct(pid);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ Error: `${err}` });
  };
});
//----------FIN ROUTER API-------------//
/////////////////////////////////////////////////////////////////////////////////////////
//--------ROUTER HANDLEBARS Y WEBSOCKET----------//
// POR POSTMAN FORM
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
// VISTA SIMPLE HTML -NO DINAMICA-
routerProd.get("/html/products", async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await productManager.getProducts();
    if (limit) {
      const prodsLimit = products.slice(0, limit);
      res.status(200).render("home", { products: prodsLimit });
    } else {
      res.status(200).render("home", { products });
    }
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});
// VISTA WEBSOCKET -DINAMICA-
routerProd.get("/realtimeproducts", async (req, res) => {  
  try {
    const products = await productManager.getProducts(); 
    res.status(200).render('realtimeproducts', { products : products });
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});
//-------FIN ROUTER HANDLEBARS Y WEBSOCKET----------//
/////////////////////////////////////////////////////////////////////////////////////////
  
export default routerProd;




//import mongoose from 'mongoose';
//const ObjectId = mongoose.Types.ObjectId; // ObjectId con ayuda de mongoose
