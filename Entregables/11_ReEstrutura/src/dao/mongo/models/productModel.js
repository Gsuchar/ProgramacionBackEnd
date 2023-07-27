import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
//--

const schema = new Schema({        
    title: { type: String/*, required: true, max: 100*/ },
    description: { type: String/*, required: true, max: 100 */},
    code: { type: Number/*, required: true, max: 100, unique: true */},
    price: { type: Number/*, required: true, max: 100*/ },
    status: { type: Boolean},
    stock: { type: Number/*, required: true, max: 100*/ },   
    category: { type: String , index: true/*,required: true, max: 100 */},
    thumbnail: { type: String}  
},{versionKey:false});//{versionKey:false} saca __v: que es para versiones por moongose

schema.plugin(mongoosePaginate);
export const ProductModel = model("products", schema);

export class ProductModel_2{
    // TRAIGO TODOS LOS PRODUCTOS SIN PAGINATE
    async getProducts(limit) {          
        try {
            const products = await ProductModel.find().limit(limit).lean().exec(); 
            return products;
        } catch (err) {           
            throw (`Error al buscar productos.`);
        }
    };

    // TRAIGO TODOS LOS PRODUCTOS CON PAGINATE
    // async getProductsPaginate(limit, page, filter, sort, attName) {          
    //     try {
    //         const sortPrice =  { price: sort } ;            
    //         const products = await ProductModel.paginate(
    //             //PRIMER {} = filtro por atributo/valor, vacio trae todo
    //             filter ? { [attName ? attName : "category"]: filter } : {},
    //             // SEGUNDO {} = limit, page, sort
    //             { limit: limit ? limit : 10 ,  lean: true, 
    //               page: page ? page : 1,                  
    //               sort: sort ?  sortPrice : ""               
    //             }
    //         ) 
    //         return products;
    //     } catch (err) {           
    //         throw (`Error al buscar productos. ${err}`);
    //     }
    // };
    async getProductsPaginate(filter, limit, lean, page, sort/*, attName*/) {          
        try {
            //const sortPrice =  { price: sort } ;            
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
                //{ _id: id },
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
            const deletedProduct = await ProductModel.findByIdAndDelete(/*{ _id: id }*/ id);
            return deletedProduct;      
        }catch (err) {
            throw (`Fallo al encontrar producto.`);
        };
    };    
 // FIN LLAVE USERMODEL_2  
}

export const productModel_2 = new ProductModel_2();