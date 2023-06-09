import { ProductModel } from '../dao/models/productModel.js';
//-----

export class ProductService {
    
    // TRAIGO TODOS LOS PRODUCTOS SIN PAGINATE
    async getProducts(limit) {          
        try {
            const products = await ProductModel.find().limit(limit).lean().exec(); 
            return products;
        } catch (err) {           
            throw (`Error al buscar productos. ${err}`);
        }
    };

    // TRAIGO TODOS LOS PRODUCTOS CON PAGINATE
    async getProductsPaginate(limit, page, filter, sort, attName) {          
        try {
            const sortPrice =  { price: sort } ;            
            const products = await ProductModel.paginate(
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
            throw (`Error al buscar productos. ${err}`);
        }
    };

    // TRAIGO PRODUCTO SEGÚN EL ID
    async getProductById(id) {
        try {
          const product = await ProductModel.find({ _id: id });
          product ? product :  (() => { throw (`El producto de id ${id} no se encontró.`) })();
          return product;
        } catch (err) {
            throw (`Error al buscar producto id ${id}. ${err}`);            
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
            const createdProduct = await ProductModel.create(newProduct);
            return createdProduct;
        }catch (err) {
            throw (`Error al agregar productos. ${err}`);
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
            const prodUpdated = await ProductModel.findByIdAndUpdate(
                { _id: id },
                productToUpdate,
                { new: true } // Esto asegura que se devuelva el documento actualizado (Mongo)
              );
            return prodUpdated;
        } catch (err) {
            throw (`No se pudo modificar producto con ID ${id}. ${err}`);
        };
    };

    // DELETE PRODUCTO
    async deleteProduct(id) {
        try {        
            const deletedProduct = await ProductModel.findByIdAndDelete({ _id: id });
            return deletedProduct;      
        }catch (err) {
            throw (`Fallo al encontrar producto. ${err}`);
        };
    };
    
 //LLAVE FIN PRODUCT SERVICE
};