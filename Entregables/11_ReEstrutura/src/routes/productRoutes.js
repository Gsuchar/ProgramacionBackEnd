import { Router } from 'express';
import { ProductManager } from "../DAO/file/ProductManager.js";
import { uploader } from '../utils.js';
import {ProductService} from "../services/productService.js"
import { productsController } from '../controllers/productController.js';


const routerProd = Router();
const productManager = new ProductManager('./src/DAO/dataFiles/products.json');
const productService = new ProductService;

//-------ROUTER MONGO----------//

// TRAIGO TODOS LOS PRODUCTOS (en caso de tener límite, trae solo la cantidad indicada)
// TODOS > http://localhost:8080/products
// Limite 2 > http://localhost:8080/products?limit=2 
routerProd.get("/products", productsController.getProducts);
routerProd.get("/productsP", productsController.getProductsPaginate);

// TRAIGO PRODUCTO SEGÚN EL ID INDICADO EN URL
routerProd.get('/products/:pid', productsController.getProductById);
// PRODUCTO NUEVO
routerProd.post("/products/new",productsController.addProduct);
// MODIFICA UN PRODUCTO EXISTENTE SEGÚN ID Y CAMPO A MODIFICAR
routerProd.put("/products/update/:pid", productsController.updateProduct);
// DELETE PRODUCTO
routerProd.delete("/products/delete/:pid", productsController.deleteProduct);
//-------FIN ROUTER MONGO----------//














//-------- ROUTER HANDLEBARS Y WEBSOCKET PRODUCTS ----------//
// VISTA WEBSOCKET -DINAMICA- PROBANDOOOOOOO
routerProd.get("/realtimeproducts", async (req, res) => {  
  try {
    const products = await productService.getProducts(); 
    res.status(200).render('realtimeproducts', { products : products });
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});
//-------FIN ROUTER HANDLEBARS Y WEBSOCKET----------//
/////////////////////////////////////////////////////////////////////////////////////////

//-------FIN ROUTER MONGO----------//
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


export default routerProd;
//ABAJO ESTA LO DE FS, NO LO SAQUE POR SI VOLVEMOS A USARLO















//*********************ANTERIOR FILESYSTEM*********************//
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//--------------ROUTER API--------------/
// TRAIGO TODOS LOS PRODUCTOS (en caso de tener límite, trae solo la cantidad indicada)
routerProd.get('/fs/api/products', async (req, res) => {
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
routerProd.get('/fs/api/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.getProductById(pid);
    res.status(200).json(product);
  } catch (err) {
      res.status(404).json({ Error: `No se encontró el producto con ID ${pid}.` });
  };
});

// MODIFICA UN PRODUCTO EXISTENTE SEGÚN ID Y CAMPO A MODIFICAR
routerProd.put('/fs/api/products/:pid', async (req, res) => {
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
routerProd.post('/fs/api/products', async (req, res) => {
  try {       
    const product = await productManager.addProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
      res.status(400).json({ Error: `${err}` });
  };
});

// DELETE PRODUCTO
routerProd.post('/fs/api/products/:pid', async (req, res) => {
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
routerProd.post('/fs/html/products', uploader.single('file'), async (req, res) => {
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
routerProd.get("/fs/html/products", async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await productManager.getProducts();
    if (limit) {
      const prodsLimit = products.slice(0, limit);
      res.status(200).render("productsHtml", { products: prodsLimit });
    } else {
      res.status(200).render("productsHtml", { products });
    }
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});
// VISTA WEBSOCKET -DINAMICA-
routerProd.get("/fs/realtimeproducts", async (req, res) => {  
  try {
    const products = await productManager.getProducts(); 
    res.status(200).render('realtimeproducts', { products : products });
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});
//-------FIN ROUTER HANDLEBARS Y WEBSOCKET----------//
/////////////////////////////////////////////////////////////////////////////////////////
  




//import mongoose from 'mongoose';
//const ObjectId = mongoose.Types.ObjectId; // ObjectId con ayuda de mongoose