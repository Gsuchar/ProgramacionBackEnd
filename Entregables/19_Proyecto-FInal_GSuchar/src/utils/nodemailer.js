//NODEMAILER
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
//-----
dotenv.config(); // Carga variables de entorno del .env
export const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false
}
  
});