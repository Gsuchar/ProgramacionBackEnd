import { ProductModel, productModel_2 } from '../DAO/mongo/models/productModel.js';
//-----

export class ProductService {
    
    // TRAIGO TODOS LOS PRODUCTOS SIN PAGINATE
    async getProducts(limit) {          
        try {
            const products = await productModel_2.getProducts(limit); 
            return products;
        } catch (err) {           
            throw (`Error al buscar productos.`);
        }
    };

    // TRAIGO TODOS LOS PRODUCTOS CON PAGINATE
    async getProductsPaginate(limit, page, filter, sort, attName) {          
        try {
            const sortPrice =  { price: sort } ;            
            const products = await productModel_2.getProductsPaginate(
                //PRIMER {} = filtro por atributo/valor, vacio trae todo
                filter ? { [attName ? attName : "category"]: filter } : {},
                // SEGUNDO {} = limit, page, sort
                { limit: limit ? limit : 10 ,  lean: true, 
                  page: page ? page : 1,                  
                  sort: sort ?  sortPrice : ""               
                }
            )
            return products;
        } catch (err) {           
            throw (`Error al buscar productos.CONTROLLER, DESDE EL MODELO >>  ${err}`);
        }
    };

    // TRAIGO PRODUCTO SEGÚN EL ID
    async getProductById(id) {
        try {
          const product = await productModel_2.getProductById({ _id: id });
          return product;
        } catch (err) {
            throw (`No se encontró producto de id ${id}.`);
        }
    };

    // PRODUCTO NUEVO
    async addProduct(newProd) {
        try {        
            const products = await this.getProducts();      
            const controlCode = products.some((product) => product.code == newProd.code);
            if (controlCode) {
                throw ("Ya existe el codigo del producto que desea ingresar.");
            };
            let newProduct = {
                title: newProd.title ? newProd.title : (() => { throw ("Debe ingresar un titulo de Producto.") })(),        
                description : newProd.description ? newProd.description : (() => { throw ("Debe ingresar una descripción de Producto.") })(),
                //&& /^\d+$/.test(newProd.param) La expresión regular /^\d+$/ comprueba si el string contiene solo dígitos => .test devuelve FALSE y rompe
                code: newProd.code && /^\d+$/.test(newProd.code) ? parseInt(newProd.code) : (() => { throw ("Debe ingresar un codigo valido de Producto.") })(),
                price: newProd.price && /^\d+$/.test(newProd.price) ? parseInt(newProd.price) : (() => { throw ("Debe ingresar un precio valido de Producto.") })(),
                status: newProd.status,
                stock: newProd.stock && /^\d+$/.test(newProd.stock) ? parseInt(newProd.stock) : (() => { throw ("Debe ingresar el stock valido de Producto.") })(),
                category: newProd.category ? newProd.category : (() => { throw ("Debe ingresar la categoria de Producto.") })(),
                thumbnail: !newProd.thumbnail ? "Sin Definir" :  newProd.thumbnail   
            };            
            const createdProduct = await productModel_2.addProduct(newProduct);
            return createdProduct;
        }catch (err) {
            throw (`Fallo agregar producto. ${err}`);
        };    
    };

    // MODIFICA UN PRODUCTO EXISTENTE SEGÚN ID Y CAMPO A MODIFICAR
    async updateProduct(id, fieldsToUpdate) {
        try {            
            const productToUpdate = { ...fieldsToUpdate };           
            // Recorre los posibles campos, asigna los campos enviados si cumplen la validacion, si no manda mensaje con error
            for (const field in fieldsToUpdate) {
                switch (field) {
                    case "title":
                        productToUpdate.title = fieldsToUpdate.title !== "" ? fieldsToUpdate.title : (() => { throw ("Debe ingresar un titulo de Producto.") })();
                        break;
                    case "description":
                        productToUpdate.description = fieldsToUpdate.description !== "" ? fieldsToUpdate.description : (() => { throw ("Debe ingresar una descripción de Producto.") })();
                        break;
                    case "code":
                        productToUpdate.code = fieldsToUpdate.code !== "" ? fieldsToUpdate.code : (() => { throw ("Debe ingresar un codigo de Producto.") })();
                        break;
                    case "price":
                        productToUpdate.price = fieldsToUpdate.price !== "" ? fieldsToUpdate.price : (() => { throw ("Debe ingresar un precio de Producto.") })();
                        break;
                    case "stock":
                        productToUpdate.stock = fieldsToUpdate.stock !== "" ? fieldsToUpdate.stock : (() => { throw ("Debe ingresar el stock de Producto.") })();
                        break;
                    case "category":
                        productToUpdate.category = fieldsToUpdate.category !== "" ? fieldsToUpdate.category : (() => { throw ("Debe ingresar la categoria de Producto.") })();
                        break;
                    default:
                        break;
                }
            };            
            const prodUpdated = await productModel_2.updateProduct( { _id: id }, productToUpdate );
            return prodUpdated;
        } catch (err) {
            throw (`No se pudo modificar producto. ${err}`);
        };
    };

    // DELETE PRODUCTO
    async deleteProduct(id) {
        try {

            const deletedProduct = await productModel_2.deleteProduct({ _id: id });
            return deletedProduct;      
        }catch (err) {
            throw (`Fallo al encontrar producto2.  ${id}`);
        };
    };

 //LLAVE FIN PRODUCT SERVICE
};

export const productService = new ProductService();