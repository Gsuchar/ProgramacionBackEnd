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
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';

  const previousPage = listProducts.hasPrevPage
    ? `<li class="page-item"><a class="page-link" href="#" onclick="onFilterChange(${listProducts.prevPage})"><-- </a></li>`
    : '';
  const nextPage = listProducts.hasNextPage ?
    `<li class="page-item"><a class="page-link" href="#" onclick="onFilterChange(${listProducts.nextPage})"> --></a></li>` : '';

  const paginationHTML = `
    ${previousPage}
    <li class="page-item"><a class="page-link">${listProducts.page} de ${listProducts.totalPages} paginas</a></li>
    ${nextPage}
  `;

  pagination.innerHTML = paginationHTML;
});



socket.on("dinamic-list-cart", (cartUpdt) => {
  const cartBody = document.getElementById("dinamic-list-cart");
  const cartText = cartUpdt.cartProducts.map((cartProduct) => `
    <p class="card-text">${cartProduct.idProduct.title} x ${cartProduct.quantity}</p>  
  
  `);
  cartBody.innerHTML = cartText.join("");
});


function onFilterChange(page) {
  const filterLimit = parseInt(document.getElementById("filterLimit").value);
  const filterSort = document.getElementById("filterSort").value;
  const filterAttName = document.getElementById("filterAttName").value;
  const filterText = document.getElementById("filterText").value;
  const filterPage = page ? page : 1
  socket.emit("onFilterChange", filterLimit, filterPage, filterSort, filterAttName, filterText);
}


function addToCart(productId) {  
  socket.emit("addToCart", productId);
}
