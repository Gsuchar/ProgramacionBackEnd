import { Router } from 'express';
import { ProductManager } from "../ProductManager.js";
import { uploader } from '../utils.js';
import { ProductModel } from "../models/productModel.js";


const routerProd = Router();
const productManager = new ProductManager('./src/dataFiles/products.json');


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
//----------FIN ROUTER API-------------//
//--------ROUTER HANDLEBARS Y WEBSOCKET----------//
/*-Postman Test-*/
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
/*- Vista Simple html-*/
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
/*--WEBSOCKET--*/
routerProd.get("/realtimeproducts", async (req, res) => {  
  try {
    const products = await productManager.getProducts(); 
    res.status(200).render('realtimeproducts', { products : products });
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});

//-------FIN ROUTER HANDLEBARS Y WEBSOCKET----------//

//CAMBIA DE FILESYSTEM A UNA BD REAL

//-------ROUTER MONGO----------//
// TODOS LOS PRODUCTOS
routerProd.get("/mongo-products", async (req, res) => {  
  try {
    const products = await ProductModel.find(); 
    res.status(200).json( { products : products });
  } catch (error) {
      res.status(500).json({ Error: `${err}` });
    }
});

// routerProd.post("/mongo-newproduct", async (req, res) => {
  
//   try {
//     const newProd =  { title, description, price, code, stock, category, thumbnail } = req.body.products;;
//     // if (!title || !description || !price || !code || !stock|| !category || !thumbnail) {
//     //   console.log(
//     //     "validation error: DEDASO MAL AL AGREGAR PROD"
//     //   );
//     //   return res.status(400).json({
//     //     status: "error",
//     //     msg: "DEDASO MAL AL AGREGAR PROD",
//     //     data: {},
//     //   });
//     // }
//     const prodToCreat = await ProductModel.create({ title, description, price, code, stock, category, thumbnail, status: true });
//     console.log(prodToCreat);
//     return res.status(201).json({ products: prodToCreat });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({
//       status: "error",
//       msg: "something went w1rong :(",
//       data: {},
//     });
//   }
// });
routerProd.post("/mongo-newproduct", async (req, res) => {
  try {
    const { title, description, price, code, stock, category, thumbnail } = req.body.products;
    const prodToCreate = await ProductModel.create({ title, description, price, code, stock, category, thumbnail, status: true });
    console.log(prodToCreate);
    return res.status(201).json({ products: prodToCreate });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      data: {},
    });
  }
});



//-------FIN ROUTER MONGO----------//
  
export default routerProd;
