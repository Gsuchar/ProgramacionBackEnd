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
      return [];
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

  //-----FALTAN TRY/CATCH, PROX DES ARREGLAR
  async addProduct(title, description, price, thumbnail, stock, code) {
    const products = await this.getProducts();
    const controlCode = products.some((product) => product.code === code);
    if (controlCode) {
      console.log("El producto que desea ingresar ya existe");
      return null;
    }

    let newProduct = {
      id: ProductManager.productGlobalID + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    while (products.some((product) => product.id === newProduct.id)) {
      newProduct.id = ProductManager.productGlobalID + 1;
      ProductManager.productGlobalID++;
    }

    ProductManager.productGlobalID++;
    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products));
    console.log(`El producto de id ${newProduct.id}, nombre ${newProduct.title}. fue ingresado correctamente.`);
    return newProduct;
  };

  //-----FALTAN LOS TRY/CATCH, PROX DES ARREGLAR
  async updateProduct(id, fieldsToUpdate) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return null;
    }
    const prodModified = {
      ...products[index],
      ...fieldsToUpdate,
      id: products[index].id,
    };
    products.splice(index, 1, prodModified);
    await fs.writeFile(this.filePath, JSON.stringify(products));
    return prodModified;
  };

  //-----FALTAN LOS TRY/CATCH, PROX DES ARREGLAR
  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return console.log(`No existe producto para el id ${id}.`);
    }
    const deletedProduct = products.splice(index, 1)[0];
    await fs.writeFile(this.filePath, JSON.stringify(products, 2));
    console.log(`El Producto de ID ${id} fue borrado.`);
    return deletedProduct;
  };
}
const products = new ProductManager("./products.json");
module.exports = ProductManager;
