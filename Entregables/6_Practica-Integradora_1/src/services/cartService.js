import { CartModel } from '../dao/models/cartModel.js';

export class CartService {
  
    async getCarts(limit) {
        try {
          const carts = await CartModel.find().limit(limit);
          //console.log(carts) 
          return carts;
        } catch (err) {
          return ['Error al obtener carts.' + ` ${err}`]
        }
      };
    
      //TRAIGO CART POR ID, no va pero ya me queda tambien.
      async getCartById(id) {
        try {
          const cart = await CartModel.find({ _id: id }); 
          if (cart) {
            return cart;
          } else {
            throw (`El carrito de id ${id} no se encontró.`);
          }
        } catch (err) {
          throw (`Error al buscar carrito. ${err}`);
        }
      };    

      //AGREGA CART VACIO DE PRODUCTOS PERO CON SU ID DE CART
      async addCart() {
        try {        
          const createdCart = await CartModel.create({});  
          return createdCart;
        } catch (err) {
          throw (`${err}`);
        };    
      };      
    
      // //AGREGA PRODUCTOS AL CART
      async addProductToCart(cartId, productId) {
        try {
          const cart = await CartModel.findById(cartId) 
          cart ?  cart :  ()=> {throw `No se encontró carrito con ID ${cartId}.`};
          // Busca productId en cart          
          const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
          productIndex === -1 ? cart.products.push({ idProduct: productId, quantity: 1 }): cart.products[productIndex].quantity++;          
          //const updatedCart = await cart.save();//metodo de moongose
          const updatedCart = await CartModel.findByIdAndUpdate(
            { _id: cartId },
            cart,
            { new: true }
          );      
          return updatedCart;
        } catch (err) {
          throw `${err}`;
        }
      };
      
      //TRAIGO LOS PRODS DEL CART SEGUN CARTID
      async getProductsByCartId(cartId) {
        try {
          const cart = await CartModel.findById(cartId)
          console.log(cart)
          const products = cart.products
          return { products };
        } catch (err) {
          throw (`No se envontro el producto.`);
        }
      };    

      //BORRO CART POR ID, no va pero ya me queda tambien x 2.  
      async deleteCart(id) {
        try {
          const deletedcart = await CartModel.findOneAndDelete({ _id: id });      
          return deletedcart;      
        }catch (err) {
          throw (`Fallo al encontrar carrito. ${err}`);
        };
      };
    

 //LAVE FIN CART SERVICE    
}