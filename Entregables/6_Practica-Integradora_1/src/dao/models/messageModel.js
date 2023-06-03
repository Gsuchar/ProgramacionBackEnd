import { Schema, model } from "mongoose";

const schema = new Schema({
   
    // code: { type: Number/*, required: true, max: 100, unique: true */},
    // category: { type: String/*,required: true, max: 100 */},
    ////////////////////////////////////////////////////////////////////////
    //{user:correoDelUsuario, message: mensaje del usuario}
    user: String,
    msg: String
},{versionKey:false});//{versionKey:false} saca __v: que es para versiones por moongose

export const MessageModel = model("messages", schema);