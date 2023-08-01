import { Router } from 'express';
//import { uploader } from '../utils.js';
import {ProductService} from "../services/productService.js"
import { productsController } from '../controllers/productController.js';
import { isAdmin, isLoged } from '../middlewares/auth.js';

const routerProd = Router();
const productService = new ProductService;

//-------ROUTER MONGO----------//

// TRAIGO TODOS LOS PRODUCTOS (en caso de tener límite, trae solo la cantidad indicada)
// TODOS > http://localhost:8080/products
// Limite 2 > http://localhost:8080/products?limit=2 
routerProd.get("/products", productsController.getProducts);
routerProd.get("/productsP", productsController.getProductsPaginate);

// TRAIGO PRODUCTO SEGÚN EL ID INDICADO EN URL
routerProd.get('/products/:pid', productsController.getProductById);
// PRODUCTO NUEVO
routerProd.post("/products/new",productsController.addProduct);
// MODIFICA UN PRODUCTO EXISTENTE SEGÚN ID Y CAMPO A MODIFICAR
routerProd.put("/products/update/:pid", productsController.updateProduct);
// DELETE PRODUCTO
routerProd.delete("/products/delete/:pid", productsController.deleteProduct);

//-------FIN ROUTER MONGO----------//

//-------- ROUTER HANDLEBARS Y WEBSOCKET PRODUCTS ----------//
// VISTA WEBSOCKET -DINAMICA-
routerProd.get("/realtimeproducts",isLoged, isAdmin,  async (req, res) => {  
  try {
    const products = await productService.getProducts(); 
    res.status(200).render('realtimeproducts',  { products : products, sessionUser : req.session.user });
  } catch (err) {
    res.status(500).alert({ Error: `1${err}` });
  }
});
// VISTA SIMPLE HTML -NO DINAMICA-
routerProd.get("/html/products", async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await productService.getProducts();
    if (limit) {
      const prodsLimit = products.slice(0, limit);
      res.status(200).render("productsHtml", { products: prodsLimit });
    } else {
      res.status(200).render("productsHtml", { products });
    }
  } catch (err) {
    res.status(500).json({ Error: `${err}` });
  }
});
//-------FIN ROUTER HANDLEBARS Y WEBSOCKET----------//
/////////////////////////////////////////////////////////////////////////////////////////

//-------FIN ROUTER MONGO----------//
export default routerProd;













