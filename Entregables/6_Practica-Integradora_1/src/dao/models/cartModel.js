import { Schema, model } from "mongoose";

const schema = new Schema({   
   
    //products: { type: Array },
    products: Array,

});

export const CartModel = model("carts", schema);

