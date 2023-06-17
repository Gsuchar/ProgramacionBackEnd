import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', productRoutes);
app.use('/', cartRoutes);
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
