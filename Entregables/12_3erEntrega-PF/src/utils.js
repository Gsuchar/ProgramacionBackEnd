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
import { MessageModel } from './DAO/mongo/models/messageModel.js';
import { cartService } from "./services/cartService.js";
import { productService } from "./services/productService.js";
//-----

export function socketServerHandler(httpServer) {
  const socketServer = new Server(httpServer);
  //const productService = new ProductService; 

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
        //console.log("UTILSS----- PROD>>"+ productId+" CART>>"+cartId)
        await cartService.addProductToCart(cartId, productId)        
        const cartUpdt = await cartService.getProductsByCartId(cartId);
        //console.log("UTILS----- CARRITO_CON_PRODAGREGADO>>  "+JSON.stringify(cartUpdt));
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
        await productService.addProduct({ ...newProd });
        const productsList = await productService.getProducts();
        socketServer.emit("products", productsList);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    socket.on("delete-product", async (productId) => {
      try {
        //console.log("del socket>>>>>>> "+productId )
        await productService.deleteProduct(productId);
        const productsUpdt = await productService.getProducts();
        //const productsUpdt = await productManager.getProducts();
        socketServer.emit("products", productsUpdt);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });    
  });

  /****** FILE SYSTEM END PRODUCTS *****/

  
};
