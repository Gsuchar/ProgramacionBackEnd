import { productDAO } from '../DAO/productDAO.js';
import EErros  from "../errors/enums.js";
import  CustomError  from "../errors/customError.js";
import { userService } from './userService.js';
import { transport } from '../utils/nodemailer.js';

//-----

export class ProductService {
    
    // TRAIGO TODOS LOS PRODUCTOS SIN PAGINATE
    async getProducts(limit) {          
        try {
            const products = await productDAO.getProducts(limit); 
            return products;
        } catch (err) {           
            throw (`Error al buscar productos.`);
        }
    };

    // TRAIGO TODOS LOS PRODUCTOS CON PAGINATE
    async getProductsPaginate(limit, page, filter, sort, attName) {          
        try {
            const sortPrice =  { price: sort } ;            
            const products = await productDAO.getProductsPaginate(
                //PRIMER {} = filtro por atributo/valor, filtra por defecto categoria, si no vacio trae todo
                filter ? { [attName ? attName : "category"]: filter } : {},
                // SEGUNDO {} = limit, page, sort
                {
                    limit: limit ? limit : 10 ,  lean: true, 
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
          const product = await productDAO.getProductById( { _id: id } );
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
                //&& /^\d+$/.test(newProd.param) La expresión regular /^\d+$/ comprueba si el string contiene solo numeros => .test devuelve FALSE y rompe
                code: newProd.code && /^\d+$/.test(newProd.code) ? parseInt(newProd.code) : (() => { throw ("Debe ingresar un codigo valido de Producto.") })(),
                price: newProd.price && /^\d+$/.test(newProd.price) ? parseInt(newProd.price) : (() => { throw ("Debe ingresar un precio valido de Producto.") })(),
                status: true,
                stock: newProd.stock && /^\d+$/.test(newProd.stock) ? parseInt(newProd.stock) : (() => { throw ("Debe ingresar el stock valido de Producto.") })(),
                category: newProd.category ? newProd.category : (() => { throw ("Debe ingresar la categoria de Producto.") })(),
                owner: newProd.owner,
                thumbnail: !newProd.thumbnail ? "Sin Definir" :  newProd.thumbnail   
            };            
            const createdProduct = await productDAO.addProduct(newProduct);
            return createdProduct;
        }catch (err) {
            //throw (`Fallo agregar producto. ${err}`); 

            // cambio por entrega 13 de manejo errores
            throw CustomError.createError({
                name: 'Al crear producto',
                message: err,
                code: EErros.ADD_PRODUCT_ERR
            });
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
            const prodUpdated = await productDAO.updateProduct( { _id: id }, productToUpdate );
            return prodUpdated;
        } catch (err) {
            throw (`No se pudo modificar producto. ${err}`);
        };
    };

    // DELETE PRODUCTO
    async deleteProduct(pid) {
        try {
            const product = await productDAO.getProductById(pid);
            const productOwner = product[0].owner; // Siempre sera la posicion 0, es algo fijo.
            const user = await userService.getUserByIdOrEmail(productOwner, null); // Si no encuentra, devuelve null
            // Si user = null, es que el producto lo cargo un admin y no tiene userid como owner
            if (user != null) {
                const deletedProduct = await productDAO.deleteProduct( { _id: pid } );
                await this.emailToOwnerProduct(user.email, user.firstName, product[0])
                return deletedProduct;
            } else {
                const deletedProduct = await productDAO.deleteProduct( { _id: pid } );
                return deletedProduct; 
            }
      
        }catch (err) {
            throw (`Fallo al encontrar producto2.  ${err}`);
        };
    };    

    async emailToOwnerProduct(email, name, product) {
        try {
          const mailOptions = {
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                subject: 'Tu Producto fue eliminado.',
                html: `
                    <p>Hola ${name}, te notificamos que uno de tus productos fue eliminado. </p>            
                    <div>  
                        <P class="card-title"><b> Titulo:</b> ${product.title}</p>            
                        <p class="card-text"><b> Id:</b> ${product._id}</p>
                        <p class="card-text"><b> Description:</b> ${product.description}</p>
                        <p class="card-text"><b> Precio:</b> ${product.price}</p>
                        <p class="card-text"><b> Codigo:</b> ${product.code}</p>
                        <p class="card-text"><b> Stock:</b> ${product.stock}</p>
                        <p class="card-text"><b> Categoría:</b> ${product.category}</p>
                        <p class="card-text"><b> Thumbnail:</b> ${product.thumbnail}</p>        
                    </div>
                    <p>Saludos.-</p>
                `
            };
            await transport.sendMail(mailOptions);
        } catch (err) {
          throw (`Fallo al enviar mail a usuarios inactivos: ${err}`);
        }
    }

 //LLAVE FIN PRODUCT SERVICE
};

export const productService = new ProductService();