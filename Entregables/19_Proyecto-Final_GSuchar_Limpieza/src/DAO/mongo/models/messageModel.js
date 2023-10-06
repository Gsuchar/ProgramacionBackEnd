import mongoose from "mongoose";
//--

const schema = new mongoose.Schema({   
    user: String,
    msg: String
},{versionKey:false});//{versionKey:false} saca __v: que es para versiones por moongose

export const MessageModel = mongoose.model("messages", schema);