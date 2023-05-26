import { Schema, model } from "mongoose";

const schema = new Schema({   
   //idProduct: { type: Number, required: true, max: 100 },
    products: { type: Array, required: true },
});

export const CartModel = model("carts", schema);

//  id: CartManager.cartGlobalID + 1, 
//         products: []
      