import mongoose from "mongoose";
//console.log(mongoose.version);
//Probando schema mongoose.Schema
const schema = new mongoose.Schema({   
    // user: { type: Number/*, required: true, max: 100, unique: true */},
    // msg: { type: String/*,required: true, max: 100 */},
    ////////////////////////////////////////////////////////////////////////
    user: String,
    msg: String
},{versionKey:false});//{versionKey:false} saca __v: que es para versiones por moongose

export const MessageModel = mongoose.model("messages", schema);