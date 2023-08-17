/***************************************************************************/
//----------------SOCKET SERVER HANDLER-------------------------------------
import { Server } from "socket.io";
//import { MessageModel } from './DAO/mongo/models/messageModel.js';
import { MessageModel } from '../DAO/mongo/models/messageModel.js';
//import { cartService } from "./services/cartService.js";
import { cartService } from "../services/cartService.js";
//import { productService } from "./services/productService.js";
import { productService } from "../services/productService.js";
//-----

export function socketServerHandler(httpServer) {
  const socketServer = new Server(httpServer);

  // Escucha/anuncia conexiones de clientes
  socketServer.on("connection", (socket) => {
    console.log("A client-socket has connected: " + socket.id);
    

    /******** SOCKET CARTS **********/
    socket.on("onFilterChange", async ( filterLimit, filterPage, filterSort, filterAttName, filterText, ) => {
      try {
        const limit = filterLimit; 
        const page = filterPage ; 
        const filter = filterText;
        const sort = filterSort; 
        const attName = filterAttName;
        const products = await productService.getProductsPaginate(limit, page, filter, sort, attName);        
        socket.emit("updatedProducts",  products  );
        
      } catch (err) {
          console.log({ Error: `${err}` });
      }
    });    
    

    socket.on("addToCart", async (productId, cartId) => {
      try {        
        await cartService.addProductToCart(cartId, productId)        
        const cartUpdt = await cartService.getProductsByCartId(cartId);
        socketServer.emit("dinamic-list-cart", cartUpdt);
      } catch (err) {
          console.log({ Error: `${err}` });
      }
    });

    socket.on("removeFromCart", async (productId, cartId) => {
      try {        
        await cartService.deleteProductFromCart(cartId, productId)        
        const cartUpdt = await cartService.getProductsByCartId(cartId);
        socketServer.emit("dinamic-list-cart", cartUpdt);
      } catch (err) {
          console.log({ Error: `${err}` });
      }
    });

    // indexProducts.js parte de socket  
    socket.on("new-product", async (newProd) => {
      try {
        await productService.addProduct({ ...newProd });
        const productsList = await productService.getProducts();
        socketServer.emit("products", productsList);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    // indexProductsToCart.js parte de socket
    socket.on("delete-product", async (productId) => {
      try {
        await productService.deleteProduct(productId);
        const productsUpdt = await productService.getProducts();
        socketServer.emit("products", productsUpdt);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });
    
    /******** FIN SOCKET CARTS **********/



    /****** CHAT **********/
    socket.on("message", async (msg) => {
      try {
        //Guarda en BD
        await MessageModel.create(msg);
        // Emit mensajes actualizados a todos los clientes
        const msgs = await MessageModel.find();
        socketServer.emit('messageLogs', msgs);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });
    /******* END CHAT ********/
    
  });

 // FIN UTILS 
};
