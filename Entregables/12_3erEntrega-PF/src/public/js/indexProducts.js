const socket = io();

const formProducts = document.getElementById("formProducts");
const title = document.getElementById("formTitle");
const description = document.getElementById("formDescription");
const price = document.getElementById("formPrice");
const code = document.getElementById("formCode");
const stock = document.getElementById("formStock");
const category = document.getElementById("formCategory");
const thumbnail = document.getElementById("formThumbnail");

//REDUCE GRACIAS A AFTER --- ARREGLO POR ENTREGABLE 5
socket.on("products", (productsList) => {
  document.getElementById("dinamic-product-list").innerHTML = productsList.reduce((acc, item) => {
    return acc + "<tr>" +
     "<th scope='row'>"+ item.id +
     "</th>" + "<td>" + item.title + "</td>" +
     "</th>" + "<td>" + item.description + "</td>" +
     "</th>" + "<td>" + item.price + "</td>" +
     "</th>" + "<td>" + item.code + "</td>" +
     "</th>" + "<td>" + item.stock + "</td>" +
     "</th>" + "<td>" + item.category + "</td>" +
     "</th>" + "<td>" + item.thumbnail + "</td>" +
     '<td>'+'<input type="submit" value="Borrar"  class="btn btn-danger " onclick="deleteProduct('+ item.id +')"/>' +
      '</td>'+
     "</tr>";
  }, "");
});

formProducts.addEventListener("submit", (e) => {
  e.preventDefault();  
  const newProd = {
    title: title.value,
    description: description.value,
    price: +price.value,    
    code: code.value,
    stock: +stock.value,
    category: category.value,
    thumbnail: thumbnail.value,
  };  
  socket.emit("new-product", newProd);
  formProducts.reset();  

});

function deleteProduct(productId) {
  socket.emit('delete-product', productId);
};