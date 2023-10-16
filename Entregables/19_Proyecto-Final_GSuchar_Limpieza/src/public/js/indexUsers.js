const socket = io();

socket.on("users", (usersList) => {
  const tableBody = document.getElementById("dinamic-product-list");
  const tableRows = usersList.map((user) => {
    const premiumClass = user.isPremium ? "green" : "gray";
    return `
      <tr>
        <td scope="row">${user._id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <span style="color: ${premiumClass}">${user.isPremium ? "SI" : "NO"}</span>
        </td>
        <td>
          <input type="submit" value="Premium"  class="btn btn-sm btn-outline-success " onclick="changePremiumUser('${user._id}')"/>
          <input type="submit" value="Borrar"  class="btn btn-sm btn-outline-danger " onclick="deleteUser('${user._id}')"/>                      
        </td>                     
      </tr>
    `;
  });
  tableBody.innerHTML = tableRows.join("");
});

function deleteUser(userId) {
  socket.emit('delete-user', userId);
};

function changePremiumUser(userId) {
  socket.emit('premium-user', userId);
};

// Escucha evento "message" para mostrar alert con mensaje
socket.on("message", (message) => {
  alert(message); 
});