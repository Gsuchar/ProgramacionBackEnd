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
    // async addProductToCart(cartId, productId, quantityP) {
    //     try {
    //         const productToCart = await ProductModel.findById(productId);
    //         productToCart ? productToCart : (() => { throw ("No existe el producto en la base de datos, verifique.") })();
    //         const cart = await CartModel.findById(cartId); 
    //         cart ?  cart : (() => { throw (`No se encontró carrito con ID ${cartId}.`) })();
    //         // Busca productId en cart          
    //         const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
    //         //IF => Si no existe el prod, agrega y su quantity dependiendo si envian cantidad o por defecto 1
    //         productIndex === -1 ? cart.products.push({ idProduct: productId, quantity: quantityP ? quantityP : 1 }) :
    //         //ELSE => Si existe, actualiza la quantity dependiendo si se envia, si no suma 1 a la existente.
    //         quantityP ? cart.products[productIndex].quantity = quantityP : cart.products[productIndex].quantity++;  
    //         const updatedCart = await CartModel.findByIdAndUpdate( { _id: cartId }, cart, { new: true } );                  
    //         return updatedCart;
    //     } catch (err) {
    //         throw (`Error al agregar producto al cart. ${err}`);
    //     }
    // };
        
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