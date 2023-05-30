import { Router } from 'express';
import { CartManager } from "../dao/CartManager.js";
import { CartModel } from "../dao/models/cartModel.js";

const routerCart = Router();
const cartManager = new CartManager('./src/dao/dataFiles/carts.json');
/**CARTS API */
// TRAIGO TODOS LOS CARRITOS (en caso de tener límite, trae solo la cantidad indicada), no iba pero ya me queda
routerCart.get('/api/carts', async (req, res) => {
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
routerCart.get('/api/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager.getProductsByCartId(cid);
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ Error: `${err}` });
  };
});
// AGREGA UN PRODUCTO A UN CARRITO EXISTENTE SEGÚN ID DE CARRITO Y ID DE PRODUCTO
routerCart.post('/api/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ Error: `${err}` });
  };
});
// AGREGO CARRITO, inicializa con cartID y un array de prods vacio
routerCart.post('/api/carts', async (req, res) => {
  try {
    const cart = await cartManager.addCart(req.body);
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ Error: `${err}` });
  };
});
// BORRO CARRITO SEGÚN ID INDICADO, no iba pero ya me queda
routerCart.post('/api/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager.deleteCart(cid);
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ Error: `${err}` });
  };
});
/**CARTS API FIN */

// TODOS LOS CARTS
routerCart.get("/mongo-carts", async (req, res) => {  
  try {
    const carts = await CartModel.find(); 
    res.status(200).json( { carts : carts });
  } catch (err) {
      res.status(500).json({ Error: `${err}` });
    }
});

//CARTS NUEVO
routerCart.post("/mongo-newcart", async (req, res) => {
  try {
    const { products } = req.body;
    const cartToCreate = await CartModel.create({ products });
    return res.status(201).json({ carts: cartToCreate });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      data: {},
    });
  }
});





export default routerCart;
