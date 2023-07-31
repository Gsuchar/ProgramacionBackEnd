//@ts-check
import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    code: { type: String, /*unique: true, required: true */},
    purchase_datetime: { type: Date, /*required: true*/ },
    amount: { type: Number, /*required: true */},
    purchaser: { type: String, /*required: true */},
    //cartId : { type: String, /*required: true */}
    products: [ { idProduct: { type: Object }, _id: false, quantity: { type: Number }, totalPrice: { type: Number } } ]//_id:false saca _id de mongoose
  },{versionKey: false}
);//{versionKey:false} saca __v: que es para versiones por moongose
export const TicketModel = model('tickets', schema);

export class TicketModel_2{
  async addTicket(newTicket) {
    //console.log("MODEL TICKET>>>  "+ JSON.stringify(newTicket))
    try {   

    const ticket = await TicketModel.create(newTicket);    
    return ticket;
    } catch (error) {
      throw (`FALLO EN MODELO.`);
    }
}






  // TRAIGO TODOS LOS USUARIOS
  // async getUsers(limit) {          
  //   try {
  //       const users = await TicketModel.find().limit(limit);
  //       return users;
  //   } catch (err) {           
  //       throw (`Error al acceder a usuarios. ${err}`);
  //   }
  // };

  // async addUser(newUser) {
  //   try {
  //     let createdUser = await TicketModel.create(newUser);
  //     return createdUser;
  //   }catch (err) {
  //     throw (`Error al agregar Usuario. ${err}`);
  //   };    
  // };
  // async updateUser(id, fieldsToUpdate) {
  //   try {
  //     //new: true => devuelve el valor actualizado. 
  //     const userUpdated = await TicketModel.findByIdAndUpdate( id, fieldsToUpdate, { new: true } );
  //     return userUpdated;
  //   } catch (err) {
  //     throw (`No se pudo modificar Usuario con ID ${id}. ${err}`);
  //   };
  // };

  // async deleteUser(id) {
  //   try {        
  //       const deletedUser = await TicketModel.findByIdAndDelete( id );
  //       return deletedUser;      
  //   }catch (err) {
  //       throw (`Fallo al borrar el Usuario. ${err}`);
  //   };
  // };
  
 // FIN LLAVE TicketModel_2  
}

export const ticketModel_2 = new TicketModel_2();