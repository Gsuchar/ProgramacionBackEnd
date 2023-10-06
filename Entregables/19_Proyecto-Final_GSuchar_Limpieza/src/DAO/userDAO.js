//@ts-check
import { UserModel } from "./mongo/models/userModel.js";


export class UserDAO{
  // TRAIGO TODOS LOS USUARIOS
  async getUsers(limit) {          
    try {
        const users = await UserModel.find().limit(limit).lean().exec();;
        return users;
    } catch (err) {           
        throw (`Error al acceder a usuarios. ${err}`);
    }
  };

  async addUser(newUser) {
    try {
      let createdUser = await UserModel.create(newUser);
      return createdUser;
    }catch (err) {
      throw (`Error al agregar Usuario. ${err}`);
    };    
  };
  async updateUser(id, fieldsToUpdate) {
    try {
      //new: true => devuelve el valor actualizado. 
      const userUpdated = await UserModel.findByIdAndUpdate( id, fieldsToUpdate, { new: true } );
      return userUpdated;
    } catch (err) {
      throw (`No se pudo modificar Usuario con ID ${id}. ${err}`);
    };
  };

  async deleteUser(id) {
    try {        
        const deletedUser = await UserModel.findByIdAndDelete( id );
        return deletedUser;      
    }catch (err) {
        throw (`Fallo al borrar el Usuario. ${err}`);
    };
  };
  async findInactiveUsers({ last_connection: { $lt: inactiveDate } }) {
    try {        
        //const deletedUser = await UserModel.findByIdAndDelete( id );
        const inactiveUsers = await UserModel.find({ last_connection: { $lt: inactiveDate } });// $lt => Operador de comparación en MongoDB, significa "menor que".

        return inactiveUsers;      
    }catch (err) {
        throw (`Fallo al borrar el Usuario. ${err}`);
    };
  };
  
  // // Obtener usuario por correo electrónico
  // async getUserByEmail(email) {
  //   try {
  //     const user = await UserModel.findOne({ email });
  //     return user;
  //   } catch (err) {
  //     throw err;
  //   }
  // }


 // FIN LLAVE UserDAO  
}

export const userDAO = new UserDAO();