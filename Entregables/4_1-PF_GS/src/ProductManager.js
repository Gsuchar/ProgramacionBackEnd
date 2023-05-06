const { nextTick } = require("process");

const fs = require("fs").promises;

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.getProducts();
    const lastProductId = this.products.length > 0 ? this.products[products.length - 1].id : 0;
    ProductManager.productGlobalID = lastProductId;
  };
  static productGlobalID = 0;

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      //Inicializa vacio
      return [666];
    }
  };

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id == id);
      if (product) {
        return product;
      } else {
        throw new Error(`El producto de id ${id} no se encontró.`);
      }
    } catch (err) {
        throw new Error(`Error al buscar producto id: ${err}`);
    }
  };
    
  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == id);
      if (index == -1) {
        throw new Error(`No existe producto para el id ${id}.`);
      }
      const deletedProduct = products.splice(index, 1)[0];
      //fs.promises.readFile
      await fs.writeFile(this.filePath, JSON.stringify(products, 2));
      //console.log(`El Producto de ID ${id} fue borrado.`);
      return deletedProduct;      
    }catch (err) {
      throw new Error(`Error al buscar producto id: ${err}`);
    };
  };
  
 
  async addProduct(title, description, code, price, stock, category, thumbnail) {
    try {    
      const products = await this.getProducts();
      const controlCode = products.some((product) => product.code == code);
      if (controlCode) {
        console.log("El producto que desea ingresar ya existe");
        return null;
      };
      let newProduct = {
        id: ProductManager.productGlobalID + 1,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnail        
      };
      //validaciones de datos, en caso que sea Falsy muestra excepción con un mensaje de error.
      newProduct.title ? Next() : (() => { throw new Error("Debe ingresar un titulo de Producto.") })();
      newProduct.description ? Next() : (() => { throw new Error("Debe ingresar una descripción de Producto.") })();
      newProduct.code ? Next() : (() => { throw new Error("Debe ingresar un codigo de Producto.") })();
      newProduct.price ? Next() : (() => { throw new Error("Debe ingresar un precio de Producto.") })();
      newProduct.stock ? Next() : (() => { throw new Error("Debe ingresar el stock de Producto.") })();
      newProduct.category ? Next() : (() => { throw new Error("Debe ingresar la categoria de Producto.") })();
      newProduct.thumbnail == undefined || null ? "No definido. ": Next();
      //newProduct.title != "" || undefined || null ? Next() :console.log("Debe ingresar un titulo de Producto.");   
      //newProduct.description == "" || undefined || null ? console.log("Debe ingresar una descripcion de Producto."): Next();
      //newProduct.code == "" || undefined || null ? console.log("Debe ingresar un codigo de Producto."): Next();
      //newProduct.price == "" || undefined || null ? console.log("Debe ingresar un precio de Producto."): Next();
      //newProduct.stock == "" || undefined || null ? console.log("Debe ingresar el stock de Producto."): Next();
      //newProduct.category == "" || undefined || null ? console.log("Debe ingresar la categoria de Producto."): Next();
      //newProduct.thumbnail == undefined || null ? " ": Next();
      
      while (products.some((product) => product.id == newProduct.id)) {
        newProduct.id = ProductManager.productGlobalID + 1;
        ProductManager.productGlobalID++;
      };
      ProductManager.productGlobalID++;
      products.push(newProduct);
      await fs.writeFile(this.filePath, JSON.stringify(products));
      console.log(`El producto de id ${newProduct.id}, nombre ${newProduct.title}. fue ingresado correctamente.`);
      return newProduct;
    }catch (err) {
      throw new Error(`Error al agregar producto.`);
    };    
  };
  
  async updateProduct(id, fieldsToUpdate) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == id);
      if (index === -1) {
        throw new Error(`Error al modificar producto.`);
      };
      const prodModified = {
        ...products[index],
        ...fieldsToUpdate,
        id: products[index].id,
      };
      products.splice(index, 1, prodModified);
      await fs.writeFile(this.filePath, JSON.stringify(products));
      return prodModified;     
    } catch (err) {
        throw new Error(`Error al modificar producto.`);
    }
  };
};
const products = new ProductManager("./products.json");
module.exports = ProductManager;
