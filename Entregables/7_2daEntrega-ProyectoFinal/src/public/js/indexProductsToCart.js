const socket = io();


socket.on("updatedProducts", (listProducts) => {
  const tableBody = document.getElementById("dinamic-product-list");
  const tableRows = listProducts.docs.map((product) => `
    <tr>
      <th scope="row">${product.id}</th>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>${product.thumbnail}</td>
      <td><input type="submit" value="Agregar" class="btn btn-success" onclick="addToCart('${product.id}')"/></td>
    </tr>
  `);
  tableBody.innerHTML = tableRows.join("");
});
socket.on("dinamic-list-cart", (cartUpdt) => {
  const dviCart = document.getElementById("dinamic-list-cart");
  dviCart.innerHTML = JSON.stringify(cartUpdt)
});


function setLimit() {
  const limit = parseInt(document.getElementById("limit").value);
  socket.emit("limitChange", limit);
}

function addToCart(productId) {  
  socket.emit("addToCart", productId);
}
