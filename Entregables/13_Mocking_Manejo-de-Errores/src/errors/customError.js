export default class CustomError {
  static createError({ name , cause, message, code/*, isJson = false*/ }) {
    const error =  Error(message, { cause });
    error.name = name;
    //error.cause = cause;
    error.code = code;
    throw error;
  }
}


