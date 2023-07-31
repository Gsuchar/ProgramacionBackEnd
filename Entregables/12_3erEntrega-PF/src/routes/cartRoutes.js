import { Router } from 'express';
import { cartsController } from '../controllers/cartController.js';
import { isLoged, isUser } from '../middlewares/auth.js';

//const productService = new ProductService;

const routerCart = Router();
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
routerCart.get("/productsToCart",isLoged, isUser, cartsController.getProductsByCartId_Paginate);


//-------FIN ROUTER HANDLEBARS Y WEBSOCKET----------//
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//-------FIN ROUTER MONGO----------//




/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
//FS ESTA ABAJO//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////




















export default routerCart;