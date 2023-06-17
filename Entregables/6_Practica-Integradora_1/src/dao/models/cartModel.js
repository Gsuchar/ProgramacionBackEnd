import { Schema, model } from "mongoose";

const schema = new Schema({
      
   products: [ { idProduct: { type: String }, quantity: { type: Number } } ]

},{versionKey:false});//{versionKey:false} saca __v: que es para versiones por moongose

export const CartModel = model("carts", schema);