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
      "mongodb+srv://USUARIO:PASS@SERVER/NOMBRE_BASE?retryWrites=true&w=majority"
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
//-----
export function socketServerHandler(httpServer) {
  const socketServer = new Server(httpServer);
  const productManager = new ProductManager('./src/dao/dataFiles/products.json');

  // Escucha/anuncia conexiones de clientes
  socketServer.on("connection", (socket) => {
    console.log("A client-socket has connected: " + socket.id);

    /******** PRODUCTS **********/
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
};
