import { Schema, model } from "mongoose";

const schema = new Schema({
   
    // code: { type: Number/*, required: true, max: 100, unique: true */},
    // category: { type: String/*,required: true, max: 100 */},
    ////////////////////////////////////////////////////////////////////////
    //{user:correoDelUsuario, message: mensaje del usuario}
    user: String,
    msg: String
});

export const MessageModel = model("messages", schema);