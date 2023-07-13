import { jugadoresService } from '../services/jugadores.service.js';

class JugadoresController {
  getAll(req, res) {
    //2 llama al servicio para que trabaje y logre lo que necesitamos
    const jugadorEncontrados = jugadoresService.getAll();
    //3 da la respuesta al usuario
    return res.json({
      status: 'success',
      payload: jugadorEncontrados,
    });
  }
  getById(req, res) {
    //1 saca los datos del req    
    const idJugador = req.params.jid;
    //2 llama al servicio para que trabaje y logre lo que necesitamos    
    const jugadorEncontrado = jugadoresService.getById(idJugador);
    //3 da la respuesta al usuario
    return res.json({
      status: 'success',
      payload: jugadorEncontrado,
    });
  }
  create(req, res) {
    //1 saca los datos del req
    const jugadorParaGuardar = req.body;
    //2 llama al servicio para que trabaje y logre lo que necesitamos
    const jugadorGuardado = jugadoresService.create(jugadorParaGuardar);
    //3 da la respuesta al usuario
    return res.json({
      status: 'success',
      payload: jugadorGuardado,
    });
  }
  edit(req, res) {
    //1 saca los datos del req
    const jugadorId = req.params.jid;
    const jugadorCampos = req.body;
    //2 llama al servicio para que trabaje y logre lo que necesitamos
    const jugadorEditado = jugadoresService.edit(jugadorId,jugadorCampos);
    //3 da la respuesta al usuario
    return res.json({
      status: 'success',
      payload: jugadorEditado,
    });
  }
  delete(req, res) {
    //1 saca los datos del req
    const jugadorId = req.params.jid;
    //2 llama al servicio para que trabaje y logre lo que necesitamos
    const jugadorBorrar = jugadoresService.delete(jugadorId);
    //3 da la respuesta al usuario
    return res.json({
      status: 'success',
      payload: jugadorBorrar,
    });
  }
}

export const jugadoresController = new JugadoresController();
