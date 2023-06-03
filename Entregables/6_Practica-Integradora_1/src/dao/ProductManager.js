import fs from "fs/promises";

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;    
    this.products = this.getProducts();
    const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    ProductManager.productGlobalID = lastProductId;
  };
  static productGlobalID = 0;
  // TRAIGO TODOS LOS PRODUCTOS
  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");      
      const products = JSON.parse(data);
      const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
      ProductManager.productGlobalID = lastProductId;
      return products;
    } catch (err) {
        return ['Error leyendo archivo de productos.'];
    }
  };
  // TRAIGO PRODUCTO SEGÚN EL ID
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id == id);
      if (product) {
        return product;
      } else {
        throw (`El producto de id ${id} no se encontró.`);
      }
    } catch (err) {
        throw (`Error al buscar producto. ${err}`);
    }
  };
 
  // PRODUCTO NUEVO
  async addProduct(newProd) {
    try {        
      const products = await this.getProducts();      
      const controlCode = products.some((product) => product.code == newProd.code);
      if (controlCode) {
        throw ("Ya existe el codigo del producto que desea ingresar.");
      };
      let newProduct = {
        id: ProductManager.productGlobalID + 1,
        title: newProd.title ? newProd.title : (() => { throw ("Debe ingresar un titulo de Producto.") })(),        
        description : newProd.description ? newProd.description : (() => { throw ("Debe ingresar una descripción de Producto.") })(),
        //&& /^\d+$/.test(newProd.param) La expresión regular /^\d+$/ comprueba si el string contiene solo dígitos => .test devuelve FALSE y rompe
        code: newProd.code && /^\d+$/.test(newProd.code) ? parseInt(newProd.code) : (() => { throw ("Debe ingresar un codigo valido de Producto.") })(),
        price: newProd.price && /^\d+$/.test(newProd.price) ? parseInt(newProd.price) : (() => { throw ("Debe ingresar un precio valido de Producto.") })(),
        status: true,
        stock: newProd.stock && /^\d+$/.test(newProd.stock) ? parseInt(newProd.stock) : (() => { throw ("Debe ingresar el stock valido de Producto.") })(),
        category: newProd.category ? newProd.category : (() => { throw ("Debe ingresar la categoria de Producto.") })(),
        thumbnail: !newProd.thumbnail ? "Sin Definir" :  newProd.thumbnail   
      };
                   
      while (products.some((product) => product.id == newProduct.id)) {
        newProduct.id = ProductManager.productGlobalID + 1;
        ProductManager.productGlobalID++;
      };
      ProductManager.productGlobalID++;
      //console.log(newProduct); 
      products.push(newProduct);
      await fs.writeFile(this.filePath, JSON.stringify(products));      
      return newProduct;
    }catch (err) {
      throw (`${err}`);
    };    
  };
  
  // MODIFICA UN PRODUCTO EXISTENTE SEGÚN ID Y CAMPO A MODIFICAR
  async updateProduct(id, fieldsToUpdate) {
    try {
        const products = await this.getProducts();
        const index = products.findIndex((product) => product.id == id);
        if (index === -1) {
            throw (`No se encontró producto a modificar con ID ${id}.`);
        };
        const productToUpdate = { ...products[index], ...fieldsToUpdate };
        const updatedProduct = { ...productToUpdate };
        //validacion de update
        for (const field in fieldsToUpdate) {
            switch (field) {
                case "title":
                    updatedProduct.title = productToUpdate.title !== "" ? productToUpdate.title : (() => { throw ("Debe ingresar un titulo de Producto.") })();
                    break;
                case "description":
                    updatedProduct.description = productToUpdate.description !== "" ? productToUpdate.description : (() => { throw ("Debe ingresar una descripción de Producto.") })();
                    break;
                case "code":
                    updatedProduct.code = productToUpdate.code !== "" ? productToUpdate.code : (() => { throw ("Debe ingresar un codigo de Producto.") })();
                    break;
                case "price":
                    updatedProduct.price = productToUpdate.price !== "" ? productToUpdate.price : (() => { throw ("Debe ingresar un precio de Producto.") })();
                    break;
                case "stock":
                    updatedProduct.stock = productToUpdate.stock !== "" ? productToUpdate.stock : (() => { throw ("Debe ingresar el stock de Producto.") })();
                    break;
                case "category":
                    updatedProduct.category = productToUpdate.category !== "" ? productToUpdate.category : (() => { throw ("Debe ingresar la categoria de Producto.") })();
                    break;
                default:
                    break;
            }
        };
        products.splice(index, 1, updatedProduct);
        await fs.writeFile(this.filePath, JSON.stringify(products));
        return updatedProduct;
    } catch (err) {
        throw (`No se pudo modificar producto con ID ${id}. ${err}`);
    };
  };
  
  // DELETE PRODUCTO    
  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == id);
      if (index == -1) {
        throw (`No existe producto para el id ${id}.`);
      }
      const deletedProduct = products.splice(index, 1)[0];      
      await fs.writeFile(this.filePath, JSON.stringify(products, 2));      
      return deletedProduct;      
    }catch (err) {
      throw (`Fallo al encontrar producto. ${err}`);
    };
  };

//LLAVE FIN PRODUCT MANAGER
};

export default new ProductManager();