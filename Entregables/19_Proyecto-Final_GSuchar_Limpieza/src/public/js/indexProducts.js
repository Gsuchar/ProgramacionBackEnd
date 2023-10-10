const socket = io();

const formProducts = document.getElementById("formProducts");
const title = document.getElementById("formTitle");
const description = document.getElementById("formDescription");
const price = document.getElementById("formPrice");
const code = document.getElementById("formCode");
const stock = document.getElementById("formStock");
const category = document.getElementById("formCategory");
const thumbnail = document.getElementById("formThumbnail");
socket.on("products", (productsList) => {
 
  const tableBody = document.getElementById("dinamic-product-list");
  const tableRows = productsList.map((product) => `
    <tr>
      <td scope="row">${product.code}</td>          
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>${product.thumbnail}</td>
      <td>
        <input type="submit" value="Borrar" class="btn btn-danger " onclick="deleteProduct('${product._id}')"/>
      </td>
    </tr>
  `);
  tableBody.innerHTML = tableRows.join("");
});


formProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  let owner;
  //En caso de ser premium asigna en owner el _id, si no asigna admin
  sessionUser.isPremium === 'true' ? owner = sessionUser._id : owner = 'admin';
  const newProd = {
    title: title.value,
    description: description.value,
    price: price.value,    
    code: code.value,
    stock: stock.value,
    status: true,
    category: category.value,
    owner,
    thumbnail: thumbnail.value,
  };
  socket.emit("new-product", newProd);
  formProducts.reset();  

});

function deleteProduct(productId) {
  socket.emit('delete-product', productId);
};