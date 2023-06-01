import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { __dirname } from "./utils.js";
import path from "path";
import handlebars from "express-handlebars";
import http from 'http';
import { connectMongo, socketServerHandler } from "./utils.js";

/***************************************************************************/


const app = express();
const port = 8080;

// Connect to MongoDB
connectMongo();

// Create HTTP server
const httpServer = http.createServer(app);

// Listen to HTTP server
httpServer.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// Socket server handler
socketServerHandler(httpServer);

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ENGINE HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Routes
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', chatRoutes);


// Handle 404 Not Found
app.get("*", (req, res) => {
  return res.status(404).json({status: "error", msg: "Not found", data: {} });
});
