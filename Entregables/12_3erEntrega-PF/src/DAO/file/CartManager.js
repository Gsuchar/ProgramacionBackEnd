import fs from "fs/promises";
import { ProductManager } from "./ProductManager.js";
//-----

export class CartManager {
  constructor(filePath) {
    this.filePath = filePath;    
    this.carts = this.getCarts();
    const lastCartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
    CartManager.cartGlobalID = lastCartId;
  };

  productManager = new ProductManager('./src/DAO/dataFiles/products.json');  
  static cartGlobalID = 0;

  //TODOS LOS CART, no va pero ya me queda pronto por si las dudas
  async getCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");      
      const carts = JSON.parse(data);
      const lastCartId = carts.length > 0 ? carts[carts.length - 1].id : 0;
      CartManager.cartGlobalID = lastCartId;
      return carts;
    } catch (err) {
      return ['Error leyendo archivo de carts.'];
    }
  };

  //TRAIGO CART POR ID, no va pero ya me queda tambien.
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id == id);
      if (cart) {
        return cart;
      } else {
        throw (`El carrito de id ${id} no se encontró.`);
      }
    } catch (err) {
      throw (`Error al buscar carrito. ${err}`);
    }
  };

  //BORRO CART POR ID, no va pero ya me queda tambien x 2.  
  async deleteCart(id) {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex((cart) => cart.id == id);
      if (index == -1) {
        throw (`No existe carrito para el id ${id}.`);
      }
      const deletedcart = carts.splice(index, 1)[0];      
      await fs.writeFile(this.filePath, JSON.stringify(carts, 2));      
      return deletedcart;      
    }catch (err) {
      throw (`Fallo al encontrar carrito. ${err}`);
    };
  };

  //AGREGA CART VACIO DE PRODUCTOS PERO CON SU ID DE CART
  async addCart() {
    try {        
      const carts = await this.getCarts();
      const newCart = {
        id: CartManager.cartGlobalID + 1, 
        products: []
      };
      carts.push(newCart);
      await fs.writeFile(this.filePath, JSON.stringify(carts));      
      return newCart;
    } catch (err) {
      throw (`${err}`);
    };    
  };

  //AGREGA PRODUCTOS AL CART 
  async addProductToCart(cartId, productId) {
    try {
      //Controla que exista carrito
      const carts = await this.getCarts();
      const index = carts.findIndex((cart) => cart.id == cartId);
      if (index === -1) {
        throw `No se encontró carrito con ID ${cartId}.`;
      };
      //Controla que exista producto
      const prods = await this.productManager.getProducts();
      const indexProds = prods.findIndex((prod) => prod.id == productId);
      if (indexProds === -1) {
        throw `No se encontró el producto con ID ${productId}, no se puede agregar.`;
      };
      const cart = carts[index];
      const product = cart.products.find((product) => parseInt(product.idProduct) == productId);
      if (product === undefined) {
        //Si en el carrito no existe el prod, lo ingresa con quantity= 1
        cart.products.push({ idProduct: parseInt(productId), quantity: 1 });
      } else {
        product.quantity++;
      };
      const updatedCarts = carts.map((c, i) => i === index ? cart : c);
      await fs.writeFile(this.filePath, JSON.stringify(updatedCarts, null, 2));
      return {
        id: parseInt(cartId),
        products: cart.products.map((p) => ({ idProduct: parseInt(p.idProduct), quantity: p.quantity }))
      };
    } catch (err) {
      throw `${err}`;
    }
  };

  //TRAIGO LOS PRODS DEL CART SEGUN CARTID
  async getProductsByCartId(cartId) {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex((cart) => parseInt(cart.id) == cartId);
      if (index == -1) {
        throw (`No se encontró carrito con ID ${cartId}.`);
      }
      const products = carts[index].products;
      return { products };
    } catch (err) {
      throw (`${err}`);
    }
  };
//LLAVE FIN CART MANAGER
};

export default new CartManager();



