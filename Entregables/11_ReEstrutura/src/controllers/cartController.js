import { cartService } from '../services/cartService.js';


class CartsController {
    // async getCarts(limit) {
    //     try {          
    //       return cartService.getCarts(limit);
    //     } catch (err) {
    //         throw (`Error al obtener carts. ${err}`);
    //     }
    // };
    async getCarts(req, res) {
        try {
            const limit = req.query.limit;
            const carts = await cartService.getCarts(limit); 
            res.status(200).json( { carts : carts });
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };
    // async getCartById(cartId) {
    //     try {
    //       const cart = await cartService.getCartById(cartId); 
    //       cart ? cart : (() => { throw (`El carrito de id ${id} no se encontró.`) })();
    //       return cart;
    //     } catch (err) {
    //         throw (`Error al buscar carrito. ${err}`);
    //     }
    //   };        
    async getCartById(req, res) {
        try {
            const cart = await cartService.addCart();
            res.status(201).json(cart);
        } catch (err) {
            res.status(400).json({ Error: `${err}` });
        };
    };

    async getProductsByCartId(req, res) {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getProductsByCartId(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
      };
    

    async addCart(req, res) {
        try {        
            const createdCart = await cartService.addCart();
            return createdCart;
        } catch (err) {
            throw (`Error al crear cart. ${err}`);
        };    
    };
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
    
    async emptyCart(req, res) {  
        try {
            const cid = req.params.cid;
            console.log(cid)
            const cart = await cartService.emptyCart(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };

    async deleteCart(req, res) {  
        try {
            const { cid } = req.params;
            const cart = await cartService.deleteCart(cid);
            res.status(200).json(cart);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    }     
    
    


 //LAVE FIN CART CONTROLLER
}

export const cartsController = new CartsController();