//----------------MONGO-----------------------------------------------------

import { connect } from "mongoose";
import dotenv from "dotenv";
//-----
dotenv.config(); // Carga variables de entorno del .env
export async function connectMongo() {
  try {
    await connect(process.env.DB_MONGO_STRING);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log(err);
    throw "Unable to connect to the database";
  }
}

/***************************************************************************/