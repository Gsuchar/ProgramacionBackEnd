import express from 'express';
//import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { __dirname } from "./utils.js";
import path from "path";
import { viewsRouters } from "./routes/viewsRoutes.js";
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
//app.use(express.static(path.join(__dirname, "public")));
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// const httpServer = app.listen(port, () => {
//   console.log(`Example app listening on http://localhost:${port}`);
// });
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//HANDLERS SOCKET
socketServer.on("connection", (socket) => {
  console.log("Un cliente se ha conectado: " + socket.id);

  //ACA RECIBO LOS DATOS DEL FRONT
  socket.on("msg_front_to_back", (data) => {
    console.log(JSON.stringify(data));
  });

  socket.emit("msg_back_to_front", { msg: "hola desde el back al socket" });

  socket.broadcast.emit("msg_back_to_todos_menos_socket", {
    msg: "hola desde el back a todos menos el socket",
  });

  socketServer.emit("msg_back_todos", { msg: "hola desde el back a todos" });

  setInterval(() => {
    socket.emit("msg", { msg: Date.now() + " hola desde el front" });
  }, 8080);
});

//API REST JSON
app.use('/', productRoutes);
app.use('/', cartRoutes);

//HTML RENDER SERVER SIDE
app.use("/", viewsRouters);
//app.use("/users", usersHtmlRouter);

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "no encontrado",
    data: {},
  });
});

