//@ts-check
import { Schema, model } from 'mongoose';

const schema = new Schema({
  firstName: { type: String/*, required: true*/, max: 100 },
  lastName: { type: String/*, required: true*/, max: 100 },
  email: { type: String/*, required: true*/, max: 100, unique: true },
  age: { type: Number },
  idCart: { type: String },
  password: { type: String/*, required: true*/, max: 100 },
  isPremium: { type: Boolean/*, required: true*/, default: false },
  role:{ type: String, default: 'user' },
  token:{ type: String, default: null },
},{versionKey: false}
);//{versionKey:false} saca __v: que es para versiones por moongose;


export const UserModel = model('users', schema);
