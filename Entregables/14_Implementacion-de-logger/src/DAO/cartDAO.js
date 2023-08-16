import { CartModel } from "./mongo/models/cartModel.js";
//--

export class CartDAO {

    async getCarts(limit) {
        try {
            const carts = await CartModel.find().limit(limit);
            return carts;
        } catch (err) {
            throw (`Error al obtener carts.`);
        }
    };
        
    //TRAIGO CART POR ID, no va pero ya me queda tambien.
    async getCartById(cartId) {
    try {
        const cart = await CartModel.findById(cartId); 
        return cart;
    } catch (err) {
        throw (`El carrito de id ${cartId} no se encontró.`);
    }
    };    

    //AGREGA CART VACIO DE PRODUCTOS PERO CON SU ID DE CART
    async addCart() {
    try {        
        const createdCart = await CartModel.create({});
        return createdCart;
    } catch (err) {
        throw (`Error al crear cart.`);
    };    
    };      
    
    //AGREGA PRODUCTOS AL CART
    async addProductToCart(cartId, cart) {
        try { 
            const updatedCart = await CartModel.findByIdAndUpdate( cartId, cart, { new: true } );
            // { new: true } => devuelve actualizado                  
            return updatedCart;
        } catch (err) {
            throw (`Error al agregar producto al cart.`);
        }
    };
        
    //TRAIGO LOS PRODS DEL CART SEGUN CARTID--POPULATE_2da ENTREGA PF
    async getProductsByCartId(cartId) {
    try {
        const cart = await CartModel.findById(cartId).populate('products.idProduct').lean();//POPULATE_2da ENTREGA PF
        const cartProducts = cart.products;      
        return { cartProducts };
    } catch (err) {
        throw (`Falló mostrar los productos del cart.`);
    }
    };

    // BORRO PRODUCTO/QUANTITY DEL CARRITO
    async deleteProductFromCart(cartId, cart) {
    try {
        const updatedCart = await CartModel.findByIdAndUpdate( cartId, cart, { new: true } );            
        return updatedCart;
    } catch (Error) {
        throw (`Error al borrar producto del cart.`);
    }
    };
    
    // UPDATE CART   
    async updateCart(cid, cartUpdate) {
        try {
            //console.log("carMODEL_UPDATE>>>>>  "+ cartUpdate)
            const updatedCart = await CartModel.findOneAndUpdate( cid, cartUpdate, {new:true} );      
            return updatedCart;      
        }catch (err) {
            throw (`Fallo al encontrar cart, no se pudo modificar.`);
        };
    };
    
    // VACIO CART SEGUN ID 
    async emptyCart(cid) {
        try {
            const emptyCart = await CartModel.findOneAndUpdate( cid, { products:[] }, {new:true} );      
            return emptyCart;      
        }catch (err) {
            throw (`Fallo al encontrar cart vaciar cart.`);
        };
    };
    
    //BORRO CART POR ID, no va pero ya me queda tambien x 2.  
    async deleteCart(id) {
    try {
        const deletedcart = await CartModel.findOneAndDelete( id );      
        return deletedcart;      
    }catch (err) {
        throw (`Fallo al encontrar o borrar cart.`);
    };
    };
    


    //LAVE FIN CART SERVICE  
}
export const cartDAO = new CartDAO();