import { jugadoresModel } from '../models/jugadores.model.js';

class JugadoresService {
  getAll() {
    //PROGRAMACION VERDADERA. LLAMAR A FUNCIONES AUX. LOOPS. IFS. ACCESOS A LA BASE SIEMPRE JUGANDO CON EL MODELO (sin acceder directamente).
    const jugadorEncontrados = jugadoresModel.getAll();
    return jugadorEncontrados;
  }
  //AL final no lo use para nada...
  getById(idJugador) {
    const jugadorEncontrado = jugadoresModel.getById(idJugador);
    return jugadorEncontrado;
  }

  create(jugadorNuevo) {
    let jugador = { ...jugadorNuevo, _id: (Math.random() + '').slice(2) };
    const jugadorParaGuardar = jugadoresModel.create(jugador);    
    return jugadorParaGuardar;
  }

  edit(idJugador, opcionEditar) {
    const jugadores = this.getAll()
    const index = jugadores.findIndex((jugador) => jugador._id == idJugador);
    if (index === -1) {
        throw (`No se encontró jugador con ID ${idJugador}.`);
    };
    const jugadorEditar = { ...jugadores[index], ...opcionEditar };
    const jugadorEditado = { ...jugadorEditar };
    for (const aEditar in opcionEditar) {
        switch (aEditar) {
            case "nombre":
                jugadorEditado.nombre = jugadorEditar.nombre !== "" ? jugadorEditar.nombre : '';
                break;
            case "goles":
                jugadorEditado.goles = jugadorEditar.goles !== "" ? jugadorEditar.goles : '';
                break;
            case "importancia":
                jugadorEditado.importancia = jugadorEditar.importancia !== "" ? jugadorEditar.importancia : '';
                break;
        }
    };
    const jugadorEditadoFIN = jugadoresModel.edit(jugadorEditado, index);
    return jugadorEditadoFIN;
  }

  delete(idJugador) {
    const jugadores = this.getAll()
    const index = jugadores.findIndex((jugador) => jugador._id == idJugador);
    if (index === -1) {
        throw (`No se encontró jugador con ID ${idJugador}.`);
    };
    const jugadorBorrado = jugadoresModel.delete( index );
    return jugadorBorrado;
  }
}

export const jugadoresService = new JugadoresService();
