import express from 'express';
//import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { __dirname } from "./utils.js";
import path from "path";

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
app.use(express.static(path.join(__dirname, "public")));
//API REST JSON
app.use('/', productRoutes);
app.use('/', cartRoutes);

// const httpServer = app.listen(port, () => {
//   console.log(`Example app listening on http://localhost:${port}`);
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
