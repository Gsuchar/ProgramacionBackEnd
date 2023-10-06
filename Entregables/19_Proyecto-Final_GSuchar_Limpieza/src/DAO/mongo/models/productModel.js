import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
//--

const schema = new Schema({        
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    code: { type: Number, required: true, max: 100, unique: true },
    price: { type: Number, required: true, max: 100 },
    status: { type: Boolean},
    stock: { type: Number, required: true, max: 100 },   
    category: { type: String , index: true, required: true, max: 100 },
    thumbnail: { type: String},  
    owner: { type: String},  
},{versionKey:false});//{versionKey:false} saca __v: que es para versiones por moongose

schema.plugin(mongoosePaginate);
export const ProductModel = model("products", schema);