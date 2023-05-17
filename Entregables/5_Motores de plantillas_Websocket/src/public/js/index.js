const socket = io();

const formProducts = document.getElementById("form-products");
const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const price = document.getElementById("form-price");
const inputCode = document.getElementById("form-code");
const stock = document.getElementById("form-stock");
const category = document.getElementById("form-category");
const thumbnail = document.getElementById("form-thumbnail");

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
function deleteProduct(productId) {
  socket.emit('delete-product', productId);
};

formProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProd = {
    title: title.value,
    description: description.value,
    price: +price.value,
    thumbnail: thumbnail.value,
    code: inputCode.value,
    stock: +stock.value,
    category: category.value,
  };  
  socket.emit("new-product", newProd);
});