class ProductManager {    
    constructor(){        
        this.prods = [];
    }
    
    static productGlobalID = 0

    addProduct(title, description, price, thumbnail, stock, code, productID = ProductManager.productGlobalID+1){
        let prod = {
            title : title,
            description : description,
            price : price,
            thumbnail : thumbnail,   
            stock : stock,
            code : code,
            productID : productID
        }
        ProductManager.productGlobalID++;
        
        return this.prods.push(prod);
    }
    
    getProds(){
        console.log(this.prods);
        return this.prods;
    }

    getProdsByCode(codProd){
        let searchCode = this.prods.find(p => p.productGlobalID === codProd);
        if (searchCode){
            return console.log(searchCode);
        }else {
            return console.log('Producto No encontrado.');
        }
    }
}


/*
De la forma que lo hice no es necesario validad si existe le codigo de producto (code),
 pero de ser necesario es agregar un if no mas, si pierdo puntos avisame q lo modifico, gracias.
*/
const newProd = new ProductManager();
newProd.addProduct( "PEPE", "asdadasdad", 100,  'https//algoalgo.com/fotoProducto2', 66, 1011);
newProd.addProduct( "AAAA", "SSSSSSSSS", 900,  'SIN DEFINIR', 33, 2011);
newProd.addProduct( "BBBBBB", "XXXXXXXXXX", 200,  'SIN DEFINIRRRRR', 60, 131);
newProd.addProduct( "CCCCCCC", "ZZZZZZZZZZZ", 1200,  'S/D', 22, 23);
newProd.addProduct( "DDDDDDDDDD", "RRRRRRR", 10,  'tttttttt', 2, 11);
newProd.getProds();
newProd.getProdsByCode(6);
