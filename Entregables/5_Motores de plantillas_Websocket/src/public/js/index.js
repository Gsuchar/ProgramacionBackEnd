const socket = io();

const formProducts = document.getElementById("form-products");
const inputTitle = document.getElementById("form-title");
const inputDescript = document.getElementById("form-description");
const inputPrice = document.getElementById("form-price");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputCategory = document.getElementById("form-category");
const inputThumbnail = document.getElementById("form-thumbnail");
const btnDelete = document.getElementById('delBtn');

//SERVER DATA
socket.on("products", (data) => {
  renderProducts(data);
});

const renderProducts = async (products) => {
  try {
    const response = await fetch("/realTimeProducts");
    const serverTemplate = await response.text();
    const template = Handlebars.compile(serverTemplate);
    const html = template({ products });
    document.getElementById("productList").innerHTML = html;
  } catch (error) {
    console.error("Error fetching server template:", error);
  }
};

formProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    title: inputTitle.value,
    description: inputDescript.value,
    price: +inputPrice.value,
    thumbnail: inputThumbnail.value,
    code: inputCode.value,
    stock: +inputStock.value,
    category: inputCategory.value,
  };  
  socket.emit("new-product", newProduct);
});

// function deleteProd(){
//   const button = document.getElementById(`btn_${id}`);
//   button.onclick = function() {
//     // Aquí puedes agregar el código que deseas ejecutar cuando se hace clic en el botón
//     console.log( button);
//   };
//   //return socket.emit("products", data)
// };