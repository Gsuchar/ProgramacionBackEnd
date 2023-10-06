//@ts-check
import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    code: { type: String },
    purchase_datetime: { type: Date },
    amount: { type: Number },
    purchaser: { type: String },
    products: [ 
      { idProduct: { type: Object },
       _id: false, quantity: { type: Number },
        totalPrice: { type: Number } 
      } ]//_id:false saca _id de mongoose
  },{versionKey: false}
);//{versionKey:false} saca __v: que es para versiones por moongose

export const TicketModel = model('tickets', schema);