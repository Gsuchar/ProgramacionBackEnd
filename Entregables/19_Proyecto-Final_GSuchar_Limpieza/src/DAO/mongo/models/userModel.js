//@ts-check
import { Schema, model } from 'mongoose';

const schema = new Schema({
  firstName: { type: String, max: 100 },
  lastName: { type: String, max: 100 },
  email: { type: String, max: 100, unique: true },
  age: { type: Number },
  idCart: { type: String },
  password: { type: String, max: 100 },
  isPremium: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  token: { type: String, default: null },
  documents: [
    {
      name: { type: String, default: null },
      reference: { type: String, default: null },
      _id: false //_id:false saca _id de mongoose
    }
  ], // documents=> array de objetos con propiedades name y reference
  last_connection: { type: Date, default: null }, 
}, { versionKey: false });

export const UserModel = model('users', schema);