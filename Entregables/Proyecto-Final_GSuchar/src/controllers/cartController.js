import { cartService } from '../services/cartService.js';
import { productService } from '../services/productService.js';
//--

class CartsController {
    // TRAE TODOS LOS CARTS
    async getCarts(req, res) {
        try {
            const limit = req.query.limit;
            const carts = await cartService.getCarts(limit); 
            res.status(200).json( { carts : carts });
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };
    
    // TRAE UN CART POR ID
    async getCartById(req, res) {
        try {
            const cart = await cartService.getCartById();
            res.status(201).json(cart);
        } catch (err) {
            res.status(400).json({ Error: `${err}` });
        };
    };

    // TRAE LOS PRODS DE UN CART POPULADOS
    async getProductsByCartId(req, res) {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getProductsByCartId(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };    

    // CREA CART VACIO
    async addCart(req, res){
        try {
            const cart = await cartService.addCart();
            res.status(201).json(cart);
        } catch (err) {
            res.status(400).json({ Error: `${err}` });
        };
    };

    // AGREGA PROD AL CART
    async addProductToCart(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const pQuantity = req.body.quantity;  
            const cart = await cartService.addProductToCart(cid, pid, pQuantity);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };        
    };
    
    // BORRA PROD DEL CART
    async deleteProductFromCart(req, res) {  
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const pQuantity = req.body.quantity;      
            const cart = await cartService.deleteProductFromCart(cid, pid, pQuantity);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };
    
    // VACIA POR COMPLETO EL CART
    async emptyCart(req, res) {  
        try {
            const cid = req.params.cid;
            const cart = await cartService.emptyCart(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };

    // BORRA EL CART
    async deleteCart(req, res) {  
        try {
            const { cid } = req.params;
            const cart = await cartService.deleteCart(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };


    //--------ROUTER HANDLEBARS Y WEBSOCKET----------//
    // VISTA SIMPLE HTML -NO DINAMICA-...extra de entrega anterior
    async getProductsByCartId_Handlebars(req, res){
        try {
            const cid = req.params.cid;
            const cartProducts = await cartService.getProductsByCartId(cid);   
            res.status(200).render("cartProducts", cartProducts);
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };
  
    // VISTA WEBSOCKET -DINAMICA-
    async getProductsByCartId_Paginate(req, res){  
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) ; 
            const filter = req.query.filter || '';
            const sort = req.query.sort ? req.query.sort : '';
            const attName = req.query.attName || '';
            const sessionUser = req.session.user;
            let displayedProducts ;
            const products = await productService.getProductsPaginate(limit, page, filter, sort, attName);
            const filteredProducts = products.docs.filter(product => product.owner !== sessionUser._id);
            // Si es usuario premium, muestra los productos que no sea owner, si no muestra todos los productos.
            sessionUser.isPremium === false ? displayedProducts = products.docs : displayedProducts = filteredProducts;
            // Traigo Productos del carrito si existen
            const oldCartUnfinished = await cartService.getProductsByCartId(sessionUser.idCart);
            res.status(200).render('productsToCart', {  displayedProducts, sessionUser, oldCartUnfinished });
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };
  
  //-------FIN ROUTER HANDLEBARS Y WEBSOCKET----------//
  /////////////////////////////////////////////////////////////////////////////////////////    


 //LAVE FIN CART CONTROLLER
}

export const cartsController = new CartsController();