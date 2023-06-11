import { Schema, model } from "mongoose";

const schema = new Schema({      
   products: [ { idProduct: { type: Schema.Types.ObjectId, ref: "products" }, quantity: { type: Number }, _id:false } ]//_id:false saca _id de mongoose
},{versionKey:false});//{versionKey:false} saca __v: que es para versiones por moongose

export const CartModel = model("carts", schema);