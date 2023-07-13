let jugadores = [];

//SOLO ACCEDE A LA BASE DE DATOS/ARCHIVO/ARRAY PARA HACER UNA OPERACION DE CRUD.
//LO QUE HACE ES SUPER ATOMICO. POCO. CORTO. PREFERENTEMENTE SIN LOOPS NI IFS.

class JugadoresModel {
  getAll() {
    const jugadorEncontrados = jugadores;
    return jugadorEncontrados;
  }

  getById(jugadorId) {  
    const jugadorBuscado = jugadores.find((jugador) => jugador._id == jugadorId);
    return jugadorBuscado;
  }

  create(jugadorNuevo) {
    jugadores.push(jugadorNuevo);
    return jugadorNuevo;
  }

  edit( jugadorEditar,jugadorIndex) {    
    jugadores[jugadorIndex] = jugadorEditar;
    return jugadores[jugadorIndex] ;
  }

  delete(jugadorIndex) {
    const jugadorBorrar = jugadores.splice(jugadorIndex, 1);
    return jugadorBorrar;
  }  
}

export const jugadoresModel = new JugadoresModel();
