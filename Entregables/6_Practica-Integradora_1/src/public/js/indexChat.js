const socket = io();

let user="";
async function UserChat() {
  const { value: email } = await Swal.fire({
    title: "Ingresa tu E-mail.",
    input: "text",
    inputLabel: "E-mail",
    inputValue: "",
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return "Debes ingresar un E-mail valido!";
      }
    },
  });

  if (email) {
    user = email;
    Swal.fire(`Te llamaras: ${user}`);
  } else {
    Swal.fire(`E-mail no ingresado`);
  }
};
UserChat();

const chatBox = document.getElementById("chatbox");

chatBox.addEventListener("keyup", ({ key }) => {
  let mess = { msg: chatBox.value, user: user };
  if (key == "Enter") {
    socket.emit("message", mess );
    chatBox.value = "";
  }
});

socket.on("messageLogs", (mens) => {
  let log = document.getElementById('messageLogs');
  //console.log(mens)
  let messages = "";
  mens.forEach(mens => {
    messages +=  "<div>";
    messages +=  `<b>${mens.user}:</b></br> ${mens.msg}</br>`;
    messages +=  "</div>";        
  });
  log.innerHTML = messages ;
  //log.innerHTML = JSON.stringify(mens)


  //console.log(productsList);
  // document.getElementById("dinamic-product-list").innerHTML = productsList.reduce((acc, item) => {
  //   return acc + "<tr>" +
  //    "<th scope='row'>"+ item.id +
  //    "</th>" + "<td>" + item.title + "</td>" +
  //    "</th>" + "<td>" + item.description + "</td>" +
  //    "</th>" + "<td>" + item.price + "</td>" +
  //    "</th>" + "<td>" + item.code + "</td>" +
  //    "</th>" + "<td>" + item.stock + "</td>" +
  //    "</th>" + "<td>" + item.category + "</td>" +
  //    "</th>" + "<td>" + item.thumbnail + "</td>" +
  //    '<td>'+'<input type="submit" value="Borrar"  class="btn btn-danger " onclick="deleteProduct('+ item.id +')"/>' +
  //     '</td>'+
  //    "</tr>";
  // }, "");
});












// const formProducts = document.getElementById("formProducts");
// const title = document.getElementById("formTitle");
// const description = document.getElementById("formDescription");
// const price = document.getElementById("formPrice");
// const code = document.getElementById("formCode");
// const stock = document.getElementById("formStock");
// const category = document.getElementById("formCategory");
// const thumbnail = document.getElementById("formThumbnail");

// //SERVER DATA --- ARREGLO POR ENTREGABLE 5
// socket.on("products", (productsList) => {
//   //console.log(productsList);
//   document.getElementById("dinamic-product-list").innerHTML = productsList.reduce((acc, item) => {
//     return acc + "<tr>" +
//      "<th scope='row'>"+ item.id +
//      "</th>" + "<td>" + item.title + "</td>" +
//      "</th>" + "<td>" + item.description + "</td>" +
//      "</th>" + "<td>" + item.price + "</td>" +
//      "</th>" + "<td>" + item.code + "</td>" +
//      "</th>" + "<td>" + item.stock + "</td>" +
//      "</th>" + "<td>" + item.category + "</td>" +
//      "</th>" + "<td>" + item.thumbnail + "</td>" +
//      '<td>'+'<input type="submit" value="Borrar"  class="btn btn-danger " onclick="deleteProduct('+ item.id +')"/>' +
//       '</td>'+
//      "</tr>";
//   }, "");
// });

// formProducts.addEventListener("submit", (e) => {
//   e.preventDefault();  
//   const newProd = {
//     title: title.value,
//     description: description.value,
//     price: +price.value,    
//     code: code.value,
//     stock: +stock.value,
//     category: category.value,
//     thumbnail: thumbnail.value,
//   };  
//   socket.emit("new-product", newProd);
//   formProducts.reset();
  

// });

// function deleteProduct(productId) {
//   socket.emit('delete-product', productId);
// };
