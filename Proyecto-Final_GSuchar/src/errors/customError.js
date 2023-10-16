// LO DEJO PERO NO LO USO EN LA ENTREGA FINAL...

export default class CustomError {

  static createError({ name , cause, message, code }) {
    // el mensaje es la cause
    const error =  Error(message, { cause });
    error.name = name;
    //error.cause = cause;
    error.code = code;
    throw error;
  }
  
}


