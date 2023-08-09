//@ts-check
import { productService } from '../services/productService.js';

class ProductsController {

    async getProducts(req, res) {          
        try {
            const limit = parseInt(req.query.limit) || 10;
            const products = await productService.getProducts(limit); 
            res.status(200).json( products );
        } catch (err) {           
            res.status(500).json({ Error: `${err}` });
        }
    };

    async getProductsPaginate(req, res){  
        try {
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) ; 
          const filter = req.query.filter || '';
          const sort = req.query.sort ? req.query.sort : '';
          const attName = req.query.attName || '';
          const products = await productService.getProductsPaginate(limit, page, filter,sort, attName);    
          res.status(200).json( { products : products });
        } catch (err) {
            res.status(500).json({ Error: `LALALA:PRODCONTROLLER>>  ${err}` });
        }
    };

    async getProductById(req, res){        
        try {
        const pid = req.params.pid;
          const product = await productService.getProductById(pid);
          res.status(200).json(product);
        } catch (err) {
            res.status(404).json({ Error: `${err}` });
        };
    };

    async addProduct(req, res) {
        try {
          const { title, description, price, code, stock, category, thumbnail } = req.body.products;
          const prodToCreate = await productService.addProduct({ title, description,  code, price, status: true, stock, category, thumbnail });    
          return res.status(201).json({ products: prodToCreate });
        } catch (err) {
            //res.status(500).json({ Error: `${err}` });
            res.status(500).json( `${err}` );// cambio por entrega 13 de manejo errores
        }
    };

    async updateProduct(req, res) {
        const { pid } = req.params;
        const fieldsToUpdate = req.body;
        try {
          const product = await productService.updateProduct(pid, fieldsToUpdate);
          res.status(200).json(product);
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };

    async deleteProduct(req, res) {
        try {
          const { pid } = req.params;
          const deleted =  await productService.deleteProduct(pid)
          return res.status(200).json(deleted);
        } catch (err) {
            res.status(500).json({ Error: `${err}` });
        }
    };    

 //FIN LLAVE PRODUCTSCONTROLLER     
};

export const productsController = new ProductsController();