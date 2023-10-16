const socket = io();


socket.on("updatedProducts", (listProducts) => {
  let displayedProducts ;
  const filteredProducts = listProducts.docs.filter(product => product.owner !== sessionUser._id);
  // Si es usuario premium, muestra los productos que no sea owner, si no muestra todos los productos.
  sessionUser.isPremium === 'false' ? displayedProducts = listProducts.docs : displayedProducts = filteredProducts;

  const tableBody = document.getElementById("dinamic-product-list");
  const tableRows = displayedProducts.map((product) => `    
    <div class="card cardsBorder-dashboard " style="width: 18rem; margin-top: 10px; ">
    <img src="img/Products/${product.thumbnail}" class="card-img-top card-header-dashboard-style" alt="...">
    <div class="card-header backgroundTable  ">
      <h5 class="card-title">${product.title}</h5>
    </div>
    <ul class="list-group list-group-flush card-body-style">
      <li class="list-group-item card-subtitle" style="border-top: 3px solid darkorange;"> ${product.description}</li>
      <li class="list-group-item">Codigo: ${product.code}</li>
      <li class="list-group-item">Precio: ${product.price}</li>
      <li class="list-group-item">Stock: ${product.stock}</li>
      <li class="list-group-item">Categoria: ${product.category}</li>
      <li class="list-group-item backgroundTable"style="border-top: 5px solid darkorange;">
        <a  class="card-link btn btn-sm btn-outline-danger" onclick="removeFromCart('${product._id}')">Quitar</a>
        <a  class="card-link btn btn-sm btn-outline-success" onclick="addToCart('${product._id}')">Agregar</a>
      </li>
    </ul>
  </div>
       
  `);

  tableBody.innerHTML = tableRows.join("");
  const pagination = document.querySelector('.pagination');
  
  

  // Si existe prevPage del populate se muestra
  const previousPage = listProducts.hasPrevPage
    ? `<li class="page-item"><a class="page-link" href="#" onclick="onFilterChange(${listProducts.prevPage})"><-- </a></li>`
    : '';
  // Si existe nextPage del populate se muestra
  const nextPage = listProducts.hasNextPage ?
    `<li class="page-item"><a class="page-link" href="#" onclick="onFilterChange(${listProducts.nextPage})"> --></a></li>` : '';

  //Render dinamicos de page-item para paginado  
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
  `)
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
  socket.emit("addToCart",  productId, sessionUser.idCart);
}
function removeFromCart(productId) { 
  socket.emit("removeFromCart",  productId, sessionUser.idCart);
}