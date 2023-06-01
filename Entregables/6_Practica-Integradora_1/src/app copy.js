import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { __dirname } from "./utils.js";
import path from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from 'http';
import { ProductManager } from "./dao/ProductManager.js";
import { connectMongo } from "./utils.js";
import { MessageModel } from './dao/models/messageModel.js';

const productManager = new ProductManager('./src/dao/dataFiles/products.json');

const app = express();
const port = 8080;
//mongo db
connectMongo();


//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);
//global mensajes
let mens=[]; 

//ESCUCHA HTTPSERVER
httpServer.listen(port, () => {
  console.log(`Server corriendo en puerto: ${port}`);
});


//ENGINE HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

//Routes
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', chatRoutes);

//HANDLERS SOCKET

socketServer.on("connection", (socket) => {
  console.log("Un cliente se ha conectado: " + socket.id);
  /******** PRODUCTS **********/
  socket.on("new-product", async (newProd) => {
    try {
      await productManager.addProduct({ ...newProd });
      const productsList = await productManager.getProducts();
      socketServer.emit("products", productsList );
      //console.log(productsList);
      //console.log(`Se ingreso el producto ${newProd.title} correctamente` );
    } catch (err) {
      console.log({ Error: `${err}` });
      
    }
  });

  socket.on("delete-product", async (productId) => {
    try {
        await productManager.deleteProduct(productId);
        const productsUpdt = await productManager.getProducts();
        socketServer.emit("products", productsUpdt);
        //console.log(`Producto id ${productId} borrado correctamente` );        
    } catch (err) {
      console.log({ Error: `${err}` });      
    }
  });
  /****** FIN PRODUCTS *****/

  /** CHAT */ 
  socket.on("message", async (msg) => {
    try {
      //unshift es parecido a push
      //mens.unshift(men);
      // Guardar el mensaje en la base de datos
    await MessageModel.create(msg);

    // Emitir los mensajes actualizados a todos los clientes
    const msgs = await MessageModel.find();
    socketServer.emit('messageLogs', msgs);
  } catch (err) {
    console.log({ Error: `${err}` });
  }
});
  /** FIN CHAT */
});
//Variable global para mensajes del chat




//PARA MOSTRAR ERROR CUANDO NO ENCUENTRA URL
app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "no encontrado",
    data: {},
  });
});

