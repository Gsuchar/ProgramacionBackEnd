// const express = require('express');
// const ProductManager = require('./ProductManager');
// const app = express();
// const port = 8080;
// app.use(express.json()); // agregamos el middleware para parsear el cuerpo de la solicitud
// const productManager = new ProductManager('./src/products.json');

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// app.use('/api/products', routerProd);

// const express = require('express');
// const ProductManager = require('./ProductManager');
// const routerProd = require('./routes/productRoutes.js');
// const app = express();
// const port = 8080;
// app.use(express.json());
// const productManager = new ProductManager('./src/products.json');

// app.use('/api/products', routerProd);

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
// import express from 'express';
// //import ProductManager from '../src/ProductManager.js';
// import routerProd from './routes/productRoutes.js';

// const app = express();
// const port = 8080;

// app.use(express.json());
// //const productManager = new ProductManager('./src/products.json');

// app.use('/api/products', routerProd);

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', productRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});