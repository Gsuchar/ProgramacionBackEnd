import { cartModel_2 } from '../DAO/mongo/models/cartModel.js';
import { productService } from '../services/productService.js';
//-----

export class CartService {

  async getCarts(limit) {
    try {
      const carts = await cartModel_2.getCarts(limit);
      return carts;
    } catch (err) {
        throw (`Error al obtener carts. ${err}`);
    }
  };

  //TRAIGO CART POR ID, no va pero ya me queda tambien.
  async getCartById(cartId) {
    try {
      const cart = await cartModel_2.getCartById(cartId); 
      cart ? cart : (() => { throw (`El carrito de id ${id} no se encontró.`) })();
      return cart;
    } catch (err) {
        throw (`Error al buscar carrito. ${err}`);
    }
  };     

  //AGREGA CART VACIO DE PRODUCTOS PERO CON SU ID DE CART
  async addCart() {
    try {        
      const createdCart = await cartModel_2.addCart();
      return createdCart;
    } catch (err) {
        throw (`Error al crear cart. ${err}`);
    };    
  };      
    
  //AGREGA PRODUCTOS AL CART
  async addProductToCart(cartId, productId, quantityP) {
    try {
      //const productToCart = await ProductModel.findById(productId);
      const productToCart = await productService.getProductById(productId);
      productToCart ? productToCart : (() => { throw ("No existe el producto en la base de datos, verifique.") })();
      //const cart = await CartModel.findById(cartId); 
      const cart = await cartModel_2.getCartById(cartId); 
      cart ?  cart : (() => { throw (`No se encontró carrito con ID ${cartId}.`) })();
      // Busca productId en cart          
      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      //IF => Si no existe el prod, agrega y su quantity dependiendo si envian cantidad o por defecto 1
      productIndex === -1 ? cart.products.push({ idProduct: productId, quantity: quantityP ? quantityP : 1 }) :
      //ELSE => Si existe, actualiza la quantity dependiendo si se envia, si no suma 1 a la existente.
      quantityP ? cart.products[productIndex].quantity = quantityP : cart.products[productIndex].quantity++;  
      //const updatedCart = await CartModel.findByIdAndUpdate( { _id: cartId }, cart, { new: true } );                  
      const updatedCart = await cartModel_2.addProductToCart( { _id: cartId }, cart, /*{ new: true }*/ );                  
      return updatedCart;
    } catch (err) {
        throw (`Error al agregar producto al cart. ${err}`);
    }
  };
      
  //TRAIGO LOS PRODS DEL CART SEGUN CARTID--POPULATE_2da ENTREGA PF
  async getProductsByCartId(cartId) {
    try {
      const cartProducts = await cartModel_2.getProductsByCartId(cartId)
      return  cartProducts ;
    } catch (err) {
      throw (`Falló mostrar los productos del cart.`);
    }
  };


  // BORRO PRODUCTO/QUANTITY DEL CARRITO
  async deleteProductFromCart(cartId, productId, quantityP) {
    try {
      //const productToCart = await ProductModel.findById(productId);
      const productToCart = await productService.getProductById(productId);
      productToCart ? productToCart : (() => { new Error  ("No existe el producto en la base de datos, verifique.") })();
      //const cart = await CartModel.findById(cartId);
      const cart = await cartModel_2.getCartById(cartId);  
      cart ?  cart : (() => {   throw Error (`No se encontró carrito con ID ${cartId}.`) })();
      // Busca productId en cart          
      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      productIndex === -1 ? "" : cart.products[productIndex].quantity--;// Existe el producto en el cart, quantity -1
      quantityP || cart.products[productIndex].quantity == 0 ? cart.products[productIndex].idProduct == productId ?// quantity parametro 0, elimina el producto del cart
       cart.products.splice(productIndex, 1) :  ""  : "";

      const updatedCart = await cartModel_2.deleteProductFromCart( { _id: cartId }, cart );            
      return updatedCart;
    } catch (err) {
        throw (`Error al borrar producto del cart. ${err}`);
    }
  };
  
  // VACIO CART SEGUN ID 
  async emptyCart(cid) {
    try {
      const emptyCart = await cartModel_2.emptyCart({ _id: cid });      
      return emptyCart;      
    }catch (err) {
      throw (`Fallo al encontrar cart. ${err}`);
    };
  };
  
  //BORRO CART POR ID, no va pero ya me queda tambien x 2.  
  async deleteCart(id) {
    try {
      const deletedcart = await cartModel_2.deleteCart({ _id: id });      
      return deletedcart;      
    }catch (err) {
      throw (`Fallo al encontrar o borrar cart.`);
    };
  };

 //LAVE FIN CART SERVICE    
};

export const cartService = new CartService();