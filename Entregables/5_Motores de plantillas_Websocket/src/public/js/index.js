const socket = io();

const formProducts = document.getElementById("formProducts");
const title = document.getElementById("formTitle");
const description = document.getElementById("formDescription");
const price = document.getElementById("formPrice");
const code = document.getElementById("formCode");
const stock = document.getElementById("formStock");
const category = document.getElementById("formCategory");
const thumbnail = document.getElementById("formThumbnail");

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
    code: code.value,
    stock: +stock.value,
    category: category.value,
    thumbnail: thumbnail.value,
  };  
  socket.emit("new-product", newProd);

});
