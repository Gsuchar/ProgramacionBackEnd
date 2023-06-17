//@ts-check
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes  from './routes/authRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { __dirname } from "./utils.js";
import path from "path";
import handlebars from "express-handlebars";
import http from 'http';
import { connectMongo, socketServerHandler } from "./utils.js";
import { iniPassport } from './config/passport.config.js';
import passport from 'passport';
import dotenv from "dotenv";
//-----


const app = express();
const port = 8080;

// Connect a MongoDB/Atlas
connectMongo();

// Crea HTTP server
const httpServer = http.createServer(app);

// Anuncia puerto
httpServer.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// Socket server handler
socketServerHandler(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Engine Handlebars para views
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");


dotenv.config(); // Carga variables de entorno del .env
app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://Gsuchar:1J0pqk2HPyyEZZl4@progbackend.muru6sp.mongodb.net/ecommerce_8?retryWrites=true&w=majority', ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

iniPassport();
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', chatRoutes);
app.use('/auth', authRoutes);

// Epic link Fail - 404 Not Found
app.get("*", (req, res) => {
  return res.status(404).json({status: "Epic error", msg: "Not found :( ", data: {} });
});
