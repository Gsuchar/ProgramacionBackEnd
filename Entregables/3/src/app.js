const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const port = 666;
const productManager = new ProductManager('./src/products.json');

//TRAIGO TODOS LOS PROD (en caso de tener limite, trae solo la cantidad indicada)
app.get('/products', async (req, res) => {
  const limit = req.query.limit;
  try{
    const products = await productManager.getProducts();  
    if (limit) {
      res.status(200).json(products.slice(0, limit));
    } else {
      res.status(404).json(products);
    };
  }catch(err){
    res.status(500).json({ error: err });
  }


});

//TRAIGO PRODUCTO SEGUN EL ID INDICADO EN URL
app.get('/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.getProductById(pid);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
