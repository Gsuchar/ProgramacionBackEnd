const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    const products = this.getProducts();
    const lastProductId = products.length > 0 ? products[products.length - 1].id : 0; //Busco ultimo ID por si ya existen datos, si no arranca en 0
    ProductManager.productGlobalID = lastProductId;
  }
  static productGlobalID = 0;

  addProduct(title, description, price, thumbnail, stock, code) {
    const products = JSON.parse(this.getProducts());
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
    fs.writeFileSync(this.filePath, JSON.stringify(products));
    console.log(`El producto de id ${newProduct.id}, nombre ${newProduct.title}. fue ingresado correctamente.`);
    return newProduct;
  }

  async getProducts() {
    let data;
    try {
      data = await fs.promises.readFile(this.filePath, "utf-8"); 
      return JSON.parse(data);     
    } catch (err) {
      return [];
    }    
  }
//OPCION ASYNC-AWAIT(test)
// async getProducts() {
//   let data;
//   try {
//     data = await fs.promises.readFile(this.filePath, "utf-8");
//   } catch (err) {
//     return [];
//   }
//   return JSON.parse(data);
// }

  getProductById(id) {
    const products = this.getProducts();
    let codSearch = products.find((product) => product.id === id);
    if (codSearch != undefined || null) {
      return console.log(codSearch);
    } else {
      return console.log(`No existe producto para el id ${id}.`);
    }
  }

  updateProduct(id, fieldsToUpdate) {
    const products = this.getProducts();
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
    fs.writeFileSync(this.filePath, JSON.stringify(products));
    return prodModified;
    
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      
      return console.log(`No existe producto para el id ${id}.`);
    }
    const deletedProduct = products.splice(index, 1)[0];
    fs.writeFileSync(this.filePath, JSON.stringify(products, 2));
    console.log(`El Producto de ID ${id} fue borrado.`);
    return deletedProduct;
  }
}


//TEST 
const products = new ProductManager("./products.json")
products.addProduct( "AAAA", "SSSSSSSSS", 111111900,  'SIN DEFINIR', 11, 331);//INGRESO PRODUCTO1
//products.addProduct( "BBBBB", "ZZZZZZZZZZ", 11,  'SIN DEFINIR', 22, 3333201);//INGRESO PRODUCTO 2 
//products.addProduct( "CCCCCCCCCCC", "RRRRRRRRRRR", 66,  'SIN DEFINIR', 1111, 5201);//INGRESO PRODUCTO 3
//products.addProduct( "DDDDDDDDDDDD", "QQQQQQQQQQQQQQQ", 9966,  'SIN DEFINIR', 575967, 444);//INGRESO PRODUCTO 4
//products.getProducts()//MUESTRO TODOS LOS PRODS
//products.getProductById(3);//BUSCO PROD CON ID=1, muestra el producto que encontro.
//products.getProductById(6);//BUSCO PROD CON ID=3,para mostrar error en caso que no encontro.
//products.updateProduct(2, { title: "CAMBIE TITULO PROD 2-------------" });// CAMBIO TITULO A PROD 2, podria variar los campos segun el parametro...
//products.deleteProduct(11) // BORRO PROD POR ID, EN ESTE CASO EL 1
//products.addProduct( "FFFFFFFFFFFF", "YYYYYYYYYYYY", 9966,  'SIN DEFINIR', 1999, 64666);//INGRESO PRODUCTO 5
//console.log(products.getProducts())//MUESTRO TODOS LOS PRODS
products.getProducts().then((data) => {
  console.log(data);
}).catch((err) => {
  console.error(err);
});