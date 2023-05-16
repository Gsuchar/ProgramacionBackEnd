import express from 'express';
//import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { __dirname } from "./utils.js";
import path from "path";
import viewsRoutes  from './routes/viewsRoutes.js';
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from 'http';



// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use('/', productRoutes);
// app.use('/', productRoutes);
// const port = process.env.PORT || 8080;
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

httpServer.listen(port, () => {
  console.log(`Server corriendo en puerto: ${port}`);
});

//HANDLERS SOCKET
socketServer.on("connection", (socket) => {
  console.log("Un cliente se ha conectado: " + socket.id);

  socket.on("new-product", async (newProd) => {
    try {
      await data.addProduct({ ...newProd });

    // Actualizando lista despues de agregar producto nuevo
      const productsList = await data.getProducts();

    io.emit("products", { productsList });

    } catch (error) {
      console.log(error);
    }

  });
});


//API REST JSON
app.use('/', productRoutes);
app.use('/', cartRoutes);

//HTML RENDER SERVER SIDE
app.use("/", viewsRoutes);

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "no encontrado",
    data: {},
  });
});

