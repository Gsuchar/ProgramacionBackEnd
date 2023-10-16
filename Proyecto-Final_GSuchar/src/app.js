import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes  from './routes/authRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { __dirname } from "./dirname.js";
import path from "path";
import handlebars from "express-handlebars";
import http from 'http';
import { connectMongo } from "./utils/mongo.js";
import { socketServerHandler } from "./utils/socket-io.js";
import { iniPassport } from './config/passport.config.js';
import passport from 'passport';
import dotenv from "dotenv";
import sessionRoutes from './routes/sessionsRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import errorHandler from "./middlewares/error.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js'; 
//-----


export const app = express();
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

// Ruta para obtener la URL absoluta del archivo "http://localhost:8080/main.css"
app.get('/maincssurl', (req, res) => {
  const cssUrl = `${req.protocol}://${req.get('host')}/main.css`;
  res.send(cssUrl);
});

// Engine Handlebars para views
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");


dotenv.config(); // Carga variables de entorno del .env
app.use(
  session({   
    store: MongoStore.create({ mongoUrl: process.env.DB_MONGO_STRING, ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);
// Passport
iniPassport();
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', chatRoutes);
app.use('/', authRoutes);
app.use('/', sessionRoutes);
app.use('/', ticketRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use(errorHandler);

// Redirección a login
app.get('/', (req, res) => {
  res.redirect('/auth/login');  
});

// Epic link Fail - 404 Not Found
app.get("*", (req, res) => {
  return res.status(404).json({status: "Epic error", msg: "Not found :( ", data: {} });
});
