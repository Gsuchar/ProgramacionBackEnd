//@ts-check
import { Schema, model } from 'mongoose';
//import monsoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema({
  firstName: { type: String/*, required: true*/, max: 100 },
  lastName: { type: String/*, required: true*/, max: 100 },
  email: { type: String/*, required: true*/, max: 100, unique: true },
  age: { type: Number },
  //idCart: { type: Schema.Types.ObjectId},
  idCart: { type: String },
  password: { type: String/*, required: true*/, max: 100 },
  isAdmin: { type: Boolean/*, required: true*/, default: false },
  role:{ type: String, default: 'user' },

});
//schema.plugin(monsoosePaginate);
export const UserModel = model('users', schema);

export class UserModel_2{
  // TRAIGO TODOS LOS USUARIOS
  async getUsers(limit) {          
    try {
        const users = await UserModel.find().limit(limit);
        return users;
    } catch (err) {           
        throw (`Error al buscar usuario. ${err}`);
    }
  };
    // TRAIGO USER SEGÚN EL ID
  //   async getUserById(id) {
  //     try {
  //       const user = await UserModel.find({ _id: id });
  //       user ? user :  (() => { throw (`El Usuario de id ${id} no se encontró.`) })();
  //       return user;
  //     } catch (err) {
  //         throw (`MODEL___Error al buscar Usuario id ${id}. ${err}`);            
  //     }
  // };
  // async getUserById(id) {
  //   const user = await UserModel.find({ _id: id });
  //   if (!user) {
  //     throw new Error(`El Usuario de id ${id} no se encontró.`);
  //   }
  //   return user;
  // }
  getUserById(id) {
    return UserModel.find({ _id: id });
  }

// async getUserById(id) {
//     const user = await UserModel.find({ _id: id });
//     return user;
// }

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
      const userUpdated = await UserModel.findByIdAndUpdate( /*{ _id: id }*/id, fieldsToUpdate, { new: true } );
      return userUpdated;
    } catch (err) {
      throw (`No se pudo modificar Usuario con ID ${id}. ${err}`);
    };
  };

  async deleteUser(id) {
    try {        
        const deletedUser = await UserModel.findByIdAndDelete(/*{ _id: id }*/id);
        //await cartService.deleteCart(cartId);
        return deletedUser;      
    }catch (err) {
        throw (`Fallo al borrar el Usuario. ${err}`);
    };
  };


  
 // FIN LLAVE USERMODEL  
}

export const userModel_2 = new UserModel_2();