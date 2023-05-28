import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { __dirname } from "./utils.js";
import path from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from 'http';
import { ProductManager } from "./dao/ProductManager.js";
import { connect } from "mongoose";

const productManager = new ProductManager('./src/dao/dataFiles/products.json');

const app = express();
const port = 8080;

//DB
export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://Gsuchar:1J0pqk2HPyyEZZl4@progbackend.muru6sp.mongodb.net/"
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
};
connectMongo();


//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

//ESCUCHA HTTPSERVER
httpServer.listen(port, () => {
  console.log(`Server corriendo en puerto: ${port}`);
});


//ENGINE HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

//HANDLERS SOCKET
socketServer.on("connection", (socket) => {
  console.log("Un cliente se ha conectado: " + socket.id);

  socket.on("new-product", async (newProd) => {
    try {
      await productManager.addProduct({ ...newProd });
      const productsList = await productManager.getProducts();
      socketServer.emit("products", productsList );
      //console.log(productsList);
      //console.log(`Se ingreso el producto ${newProd.title} correctamente` );
    } catch (err) {
      console.log({ Err11or: `${err}` });
      
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
});


//Routes
app.use('/', productRoutes);
app.use('/', cartRoutes);


//PARA MOSTRAR ERROR CUANDO NO ENCUENTRA URL
app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "no encontrado",
    data: {},
  });
});

