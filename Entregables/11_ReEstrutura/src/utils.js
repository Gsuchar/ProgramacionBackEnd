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
import dotenv from "dotenv";
//-----
dotenv.config(); // Carga variables de entorno del .env
export async function connectMongo() {
  try {
    await connect(process.env.DB_MONGO_STRING);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log(err);
    throw "Unable to connect to the database";
  }
}

/***************************************************************************/
//----------------bcrypt------------------------------
import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);



/***************************************************************************/
//----------------SOCKET SERVER HANDLER-------------------------------------
import { Server } from "socket.io";
import { ProductManager } from "./DAO/file/ProductManager.js";
import { MessageModel } from './DAO/mongo/models/messageModel.js';
import { CartService } from "./services/cartService.js";
import { ProductService } from "./services/productService.js";
//-----

export function socketServerHandler(httpServer) {
  const socketServer = new Server(httpServer);
  const productManager = new ProductManager('./src/DAO/dataFiles/products.json');
  const cartService = new CartService; 
  const productService = new ProductService; 

  // Escucha/anuncia conexiones de clientes
  socketServer.on("connection", (socket) => {
    console.log("A client-socket has connected: " + socket.id);
    

    /******** SOCKET CARTS **********/
    let userId;
    let cartId;

    // Solo visual a modo referencial el usuario y el cart nuevo al entrar-IGNORAR SI MAREA-
    cartService.addCart().then((cart) => {
      console.log("userId =>>> " + socket.id + "  cartId =>>> " + cart._id);
      userId = socket.id; //ID del socket como identificador único del usuario-IGNORAR SI MAREA-
      cartId = cart._id //ID carrito perteneciente al usuario-IGNORAR SI MAREA-   
      }).catch((err) => {
          console.error("Error creando cart: ", err);
        });


    socket.on("onFilterChange", async ( filterLimit, filterPage, filterSort, filterAttName, filterText) => {
      try {
        const limit = filterLimit; 
        const page = filterPage ; 
        const filter = filterText;
        const sort = filterSort; 
        const attName = filterAttName;
        const products = await productService.getProductsPaginate(limit, page, filter, sort, attName);        
        socket.emit("updatedProducts",  products );
      } catch (err) {
          console.log({ Error: `${err}` });
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
  });

  /****** FILE SYSTEM END PRODUCTS *****/

  
};
