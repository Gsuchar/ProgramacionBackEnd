import { UserModel } from "./mongo/models/userModel.js";
//--

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
        // $lt => Operador de comparación en MongoDB, significa "menor que".
        // Solo trae rol = 'user'        
        const inactiveUsers = await UserModel.find({ last_connection: { $lt: inactiveDate }, role: 'user' });
        return inactiveUsers;      
    }catch (err) {
        throw (`Fallo al borrar el Usuario. ${err}`);
    };
  };
  
 // FIN LLAVE UserDAO  
}

export const userDAO = new UserDAO();