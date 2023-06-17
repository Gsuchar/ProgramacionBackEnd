import { CartModel } from '../dao/models/cartModel.js';
import { ProductModel } from '../dao/models/productModel.js';
//-----

export class CartService {

  async getCarts(limit) {
    try {
      const carts = await CartModel.find().limit(limit);
      //console.log(carts)
      return carts;
    } catch (err) {
        throw ['Error al obtener carts.' + ` ${err}`];
    }
  };
    
  //TRAIGO CART POR ID, no va pero ya me queda tambien.
  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId); 
      cart ? cart : (() => { throw (`El carrito de id ${id} no se encontró.`) })();
      return cart;
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
    
  //AGREGA PRODUCTOS AL CART
  async addProductToCart(cartId, productId) {
    try {
      const productToCart = await ProductModel.findById(productId);
      productToCart ? productToCart : (() => { throw ("No existe el producto en la base de datos, verifique.") })();
      const cart = await CartModel.findById(cartId); 
      cart ?  cart : (() => { throw (`No se encontró carrito con ID ${cartId}.`) })();
      // Busca productId en cart          
      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      productIndex === -1 ? cart.products.push({ idProduct: productId, quantity: 1 }) : cart.products[productIndex].quantity++;          
      //const updatedCart = await cart.save();//metodo de moongose-probando-
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
      const cart = await CartModel.findById(cartId);
      const products = cart.products;
      return { products };
    } catch (err) {
        throw (`No se encontró el producto.`);
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

  // BORRO PRODUCTO/QUANTITY DEL CARRITO
  async deleteProductFromCart(cartId, productId) {
    try {
      const productToCart = await ProductModel.findById(productId);
      productToCart ? productToCart : (() => { throw ("No existe el producto en la base de datos, verifique.") })();
      const cart = await CartModel.findById(cartId); 
      cart ?  cart : (() => { throw (`No se encontró carrito con ID ${cartId}.`) })();
      // Busca productId en cart          
      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      productIndex === -1 ? "" : cart.products[productIndex].quantity--;
      // De llegar a 0 quantity borra el producto del carrito
      cart.products[productIndex].quantity == 0 ? cart.products.splice(productIndex, 1) : "" ;
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

 //LAVE FIN CART SERVICE    
};