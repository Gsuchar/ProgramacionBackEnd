import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
//--

const schema = new Schema({        
    title: { type: String, max: 100},
    description: { type: String, max: 100 },
    code: { type: Number},
    price: { type: Number},
    status: { type: Boolean, default: true},
    stock: { type: Number },   
    category: { type: String , index: true, max: 100 },
    thumbnail: { type: String, max: 100},  
    owner: { type: String},  
},{versionKey:false});//{versionKey:false} saca __v: que es para versiones por moongose

schema.plugin(mongoosePaginate);

export const ProductModel = model("products", schema);