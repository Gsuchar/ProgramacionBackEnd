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
        throw (`1XX__${err}`);
    };    
  };      
    
  //AGREGA PRODUCTOS AL CART
  async addProductToCart(cartId, productId, quantityP) {
    try {
      const productToCart = await ProductModel.findById(productId);
      productToCart ? productToCart : (() => { throw ("No existe el producto en la base de datos, verifique.") })();
      const cart = await CartModel.findById(cartId); 
      cart ?  cart : (() => { throw (`No se encontró carrito con ID ${cartId}.`) })();
      // Busca productId en cart          
      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      //IF => Si no existe el prod, agrega y su quantity dependiendo si envian cantidad o por defecto 1
      productIndex === -1 ? cart.products.push({ idProduct: productId, quantity: quantityP ? quantityP : 1 }) :
      //ELSE => Si existe, actualiza la quantity dependiendo si se envia, si no suma 1 a la existente.
      quantityP ? cart.products[productIndex].quantity = quantityP : cart.products[productIndex].quantity++;  
      const updatedCart = await CartModel.findByIdAndUpdate( { _id: cartId }, cart, { new: true } );                  
      return updatedCart;
    } catch (err) {
        throw `${err}`;
    }
  };
      
  //TRAIGO LOS PRODS DEL CART SEGUN CARTID--POPULATE_2da ENTREGA PF
  async getProductsByCartId(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate('products.idProduct').lean();//POPULATE_2da ENTREGA PF
      const cartProducts = cart.products;      
      return { cartProducts };
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
  // VACIO CART SEGUN ID 
  async emptyCart(cid) {
    try {
      //const resetCart = products : []
      const emptyCart = await CartModel.findOneAndUpdate({ _id: cid }, {products:[]}, {new:true});      
      return emptyCart;      
    }catch (err) {
      throw (`Fallo al encontrar carrito. ${err}`);
    };
  };

  // BORRO PRODUCTO/QUANTITY DEL CARRITO
  async deleteProductFromCart(cartId, productId, quantityP) {
    try {
      
      //console.log(quantityP)

      const productToCart = await ProductModel.findById(productId);
      productToCart ? productToCart : (() => { new Error  ("No existe el producto en la base de datos, verifique.") })();
      const cart = await CartModel.findById(cartId); 
      cart ?  cart : (() => {   throw Error (`No se encontró carrito con ID ${cartId}.`) })();
      // Busca productId en cart          
      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      productIndex === -1 ? "" : cart.products[productIndex].quantity--;


            // //IF => Si no existe el prod, agrega y su quantity dependiendo si envian cantidad o por defecto 1
            // productIndex === -1 ? "" :
            // //ELSE => Si existe, actualiza la quantity dependiendo si se envia, si no suma 1 a la existente.
            // quantityP ? cart.products[productIndex].quantity = quantityP : cart.products[productIndex].quantity--; 



            console.log(cart.products[productIndex].idProduct, productId)

      // De llegar a 0 quantity borra el producto del carrito
      //cart.products[productIndex].quantity === 0 ? cart.products.splice(productIndex, 1) : "" ;
      quantityP == 0 ? cart.products[productIndex].idProduct == productId ?
       cart.products.splice(productIndex, 1) :  (() => {  Error ("666") })()
       : "";

      const updatedCart = await CartModel.findByIdAndUpdate( { _id: cartId }, cart, { new: true } );            
      return updatedCart;
    } catch (Error) {
        //throw `${Error}`;
        throw `ERRORS`;
    }
  };

 //LAVE FIN CART SERVICE    
};