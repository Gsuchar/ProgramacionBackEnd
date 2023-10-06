import { ProductModel } from "./mongo/models/productModel.js";
//--


export class ProductDAO{
    // TRAIGO TODOS LOS PRODUCTOS SIN PAGINATE
    async getProducts(limit) {          
        try {
            const products = await ProductModel.find().limit(limit).lean().exec(); 
            return products;
        } catch (err) {           
            throw (`Error al buscar productos.`);
        }
    };

    async getProductsPaginate(filter, limit, lean, page, sort ) {          
        try {
            const products = await ProductModel.paginate( filter , limit ,  lean, page, sort  ) 
            return products;
        } catch (err) {           
            throw (`Error al buscar productos. MODELO `);
        }
    };

    // TRAIGO PRODUCTO SEGÚN EL ID
    async getProductById(id) {
        try {
          const product = await ProductModel.find({ _id: id });
          return product;
        } catch (err) {
            throw (`No se encontró el producto.`);            
        }
    };

    // PRODUCTO NUEVO
    async addProduct(newProd) {
        try {        
            const createdProduct = await ProductModel.create(newProd);
            return createdProduct;
        }catch (err) {
            throw (`Fallo agregar producto`);
        };    
    };

    async updateProduct(id, fieldsToUpdate) {
        try {         
            const prodUpdated = await ProductModel.findByIdAndUpdate(
                id,
                fieldsToUpdate,
                { new: true } // Esto asegura que se devuelva el documento actualizado (Mongo)
              );
            return prodUpdated;
        } catch (err) {
            throw (`No se pudo modificar producto con ID ${id}.`);
        };
    };

    // DELETE PRODUCTO
    async deleteProduct(id) {
        try {        
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            return deletedProduct;      
        }catch (err) {
            throw (`Fallo al encontrar producto1.`);
        };
    };    
 // FIN LLAVE PRODUCTDAO
}

export const productDAO = new ProductDAO();