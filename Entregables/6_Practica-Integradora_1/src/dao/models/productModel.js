import { Schema, model } from "mongoose";

const schema = new Schema({
        
    // title: { type: String/*, required: true, max: 100*/ },
    // description: { type: String/*, required: true, max: 100 */},
    // code: { type: Number/*, required: true, max: 100, unique: true */},
    // price: { type: Number/*, required: true, max: 100*/ },
    // status: { type: Boolean},
    // stock: { type: Number/*, required: true, max: 100*/ },   
    // category: { type: String/*,required: true, max: 100 */},
    // thumbnail: { type: String}

    title : String,
    description: String ,
    code:  Number,
    price: Number,
    status:  Boolean,
    stock: Number,   
    category: String,
    thumbnail:  String
});

export const ProductModel = model("products", schema);