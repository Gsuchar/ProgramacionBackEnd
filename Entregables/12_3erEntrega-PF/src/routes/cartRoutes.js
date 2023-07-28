import { Router } from 'express';
import { CartManager } from "../DAO/file/CartManager.js";
import { CartService } from '../services/cartService.js';
import {ProductService} from "../services/productService.js"
import { cartsController } from '../controllers/cartController.js';
//const productService = new ProductService;

const routerCart = Router();
const cartManager = new CartManager('./src/DAO/dataFiles/carts.json');//FS
//const cartService = new CartService;


// TRAIGO TODOS LOS CARRITOS (en caso de tener límite, trae solo la cantidad indicada), no iba pero ya me queda
routerCart.get("/carts", cartsController.getCarts);

// TRAIGO PRODUCTOS DEL CARRITO SEGÚN EL ID INDICADO EN URL
routerCart.get('/carts/:cid', cartsController.getProductsByCartId);

// AGREGO CARRITO, inicializa con cartID y un array de prods vacio
routerCart.put('/carts/new', cartsController.addCart);

// AGREGA UN PRODUCTO Y QUANTITY A UN CARRITO 
routerCart.put('/carts/:cid/product/:pid',cartsController.addProductToCart);

// BORRO PRODUCTO/QUANTITY DEL CARRITO
routerCart.delete('/carts/delete/:cid/product/:pid', cartsController.deleteProductFromCart);

// VACIO CARRITO SEGÚN ID INDICADO
routerCart.delete('/carts/empty/:cid',cartsController.emptyCart);

// BORRO CARRITO SEGÚN ID INDICADO, no iba pero ya me queda
routerCart.delete('/carts/deleteAll/:cid', cartsController.deleteCart);







//================ TESTING =====================================//
//--------ROUTER HANDLEBARS Y WEBSOCKET----------//
// VISTA SIMPLE HTML -NO DINAMICA-
routerCart.get("/carts/products/:cid", cartsController.getProductsByCartId_Handlebars);

// VISTA WEBSOCKET -DINAMICA-
routerCart.get("/productsToCart", cartsController.getProductsByCartId_Paginate);


//-------FIN ROUTER HANDLEBARS Y WEBSOCKET----------//
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//-------FIN ROUTER MONGO----------//




/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//FS ESTA ABAJO//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////























//*********************ANTERIOR FILESYSTEM*********************//
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//--------------ROUTER API--------------/
// TRAIGO TODOS LOS CARRITOS (en caso de tener límite, trae solo la cantidad indicada), no iba pero ya me queda
routerCart.get('/fs/api/carts', async (req, res) => {
  const limit = req.query.limit;
  try {
    const carts = await cartManager.getCarts();
    if (limit) {
      res.status(200).json(carts.slice(0, limit));
    } else {
      res.status(200).json(carts);
    };
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  };
});

// TRAIGO PRODUCTOS DEL CARRITO SEGÚN EL ID INDICADO EN URL
routerCart.get('/fs/api/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager.getProductsByCartId(cid);
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ Error: `${err}` });
  };
});

// AGREGO CARRITO, inicializa con cartID y un array de prods vacio
routerCart.post('/fs/api/carts', async (req, res) => {
  try {
    const cart = await cartManager.addCart(req.body);
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ Error: `${err}` });
  };
});

// AGREGA UN PRODUCTO A UN CARRITO EXISTENTE SEGÚN ID DE CARRITO Y ID DE PRODUCTO
routerCart.post('/fs/api/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ Error: `${err}` });
  };
});

// BORRO CARRITO SEGÚN ID INDICADO, no iba pero ya me queda
routerCart.post('/fs/api/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager.deleteCart(cid);
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ Error: `${err}` });
  };
});

//----------FIN ROUTER API-------------//
/////////////////////////////////////////////////////////////////////////////////////////


export default routerCart;