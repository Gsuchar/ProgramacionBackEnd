const socket = io();

socket.on("users", (usersList) => {
 
  const tableBody = document.getElementById("dinamic-product-list");
  const tableRows = usersList.map((user) => `
    <tr>
    <td scope="row">${user._id}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    <td>${user.role}</td>
    <td>
      {{#if user.isPremium}}
        <span style="color: green">SI</span>
      {{else}}
        <span style="color: gray">NO</span>
      {{/if}}
    </td>
    <td>
      <input type="submit" value="Premium"  class="btn btn-sm btn-outline-success " onclick="deleteProduct('{{this._id}}')"/>
      <input type="submit" value="Borrar"  class="btn btn-sm btn-outline-danger " onclick="deleteUser('${user._id}')"/>                      
    </td>                     
  </tr>

  `);
  tableBody.innerHTML = tableRows.join("");
});

function deleteUser(userId) {
  //console.log("del indexPRODUCTS>>>>>>> "+productId )
  socket.emit('delete-user', userId);
};