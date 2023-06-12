/***************************************************************************/
//----------------MULTER----------------------------------------------------
import multer from "multer";
//-----
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });


/***************************************************************************/
//----------------__DIRNAME-------------------------------------------------
import path from "path";
import { fileURLToPath } from "url";
//-----
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


/***************************************************************************/
//----------------MONGO-----------------------------------------------------
import { connect } from "mongoose";
//-----
export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://Gsuchar:1J0pqk2HPyyEZZl4@progbackend.muru6sp.mongodb.net/ecommerce_PF_Entrega-2?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB!");
  } catch (e) {
    console.log(e);
    throw "Unable to connect to the database";
  }
};


/***************************************************************************/
//----------------SOCKET SERVER HANDLER-------------------------------------
import { Server } from "socket.io";
import { ProductManager } from "./dao/ProductManager.js";
import { MessageModel } from './dao/models/messageModel.js';
import { CartService } from "./services/cartService.js";
import { ProductService } from "./services/productService.js";
//-----
export function socketServerHandler(httpServer) {
  const socketServer = new Server(httpServer);
  const productManager = new ProductManager('./src/dao/dataFiles/products.json');
  const cartService = new CartService; 
  const productService = new ProductService; 

  // Escucha/anuncia conexiones de clientes
  socketServer.on("connection", (socket) => {
    console.log("A client-socket has connected: " + socket.id);
    
    /******** SOCKET CARTS **********/
    let userId;
    let cartId;
    cartService.addCart().then((cart) => {
      console.log("userId =>>> " + socket.id + "  cartId =>>> " + cart._id);
      userId = socket.id; //ID del socket como identificador único del usuario
      cartId = cart._id //ID carrito perteneciente al usuario        
      }).catch((err) => {
          console.error("Error creando cart: ", err);
        });

    socket.on("limitChange", async (limit) => {
      try {
        const page = 1;
        const products = await productService.getProductsPaginate(limit, page);
        socket.emit("updatedProducts", products);
      } catch (err) {
       console.log({ Error: `${err}` })
      }
    });

    socket.on("sortChange", async (orderPrice) => {
      try {
        //const sort = toString(orderPrice);
        //const sort = orderPrice ? { price: orderPrice } : '';
        console.log(orderPrice)
        const limit =  10; // Valor predeterminado si no se proporciona
        const page =  1; // Valor predeterminado si no se proporciona
        const filter =  '';
        const sort =  { price: orderPrice } ;
        const attName =  '';
        const products = await productService.getProductsPaginate( limit, page, sort);
        console.log(products)
        socket.emit("updatedProducts", products);
      } catch (err) {
       console.log({ Error: `${err}` })
      }
    });

    socket.on("addToCart", async (productId) => {
      try {
        await cartService.addProductToCart(cartId, productId)
        const cartUpdt = await cartService.getProductsByCartId(cartId);
        socketServer.emit("dinamic-list-cart", cartUpdt);
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
    /******** FILE SYSTEM PRODUCTS **********/
    socket.on("new-product", async (newProd) => {
      try {
        await productManager.addProduct({ ...newProd });
        const productsList = await productManager.getProducts();
        socketServer.emit("products", productsList);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    socket.on("delete-product", async (productId) => {
      try {
        await productManager.deleteProduct(productId);
        const productsUpdt = await productManager.getProducts();
        socketServer.emit("products", productsUpdt);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });
    /****** END PRODUCTS *****/

    
  });
};
