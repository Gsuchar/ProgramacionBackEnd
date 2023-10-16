Detalle Proyecto Final Programación Backend

A continuación hare una breve descripción del proyecto, de las partes a tener en cuenta básicamente porque es la sumatoria de todas las entregas realizadas, en algunos casos saque cosas y en otros agregue…

Con respecto a lo que solicitaba la letra de la clase 46:

GET de usuarios:
  -	Ruta con DTO en usuario:
    o	https://pf-backend-gsuchar.onrender.com/api/users
  -	Ruta sin DTO en usuario(extra):
    o	https://pf-backend-gsuchar.onrender.com/users

DELETE de usuarios inactivos:
  -	Se borraran todos los usuarios sin conexión en los últimos 30 minutos(lo deje así para que sea mas fácil), también se borraran los carts asociados a dichos usuarios.  
    Ruta para postman:
      o	https://pf-backend-gsuchar.onrender.com/deleteInactiveUsers

VISTA ADMIN > Listado de usuarios, eliminación y cambio de usuario premium:
  -	Una vez logueado con la cuenta admin, ir al panel de USUARIOS. Dentro se mostrará una lista de usuarios con datos básicos y 2 botones, Premium y Borrar.
    Botones:
      o	Premium:
        	Utilizado para cambiar el estado del usuario, pasarlo a premium o viceversa, lo único a tener en cuenta es que, para pasar un usuario a premium, previamente debió cargar desde su perfil, los 3 documentos solicitados en la letra de una entrega anterior (Identificación, Comprobante de domicilio y Comprobante de Estado de Cuenta Bancaria), de lo contrario mostrara mensaje de error.
      o	Borrar:
        	Borra el usuario correspondiente.

PRODUCTOS DE USERS PREMIUM:
  -	Para entrar en la opción del dashboard PRODUCTOS debe ser admin o un usuario premium. 
  -	En caso de ser admin vera todos los productos existentes y al borrar un producto que sea de un usuario premium, enviara un mail informando al usuario que borraron su producto.
  -	En caso de ser usuario Premium, solo vera sus productos creados y podrá eliminarlos.

VISTAS Y FLUJO DE COMPRA:
  -	Desde dashboard, podemos ir a “La Tiendita”, solo podrán acceder los usuarios comunes y usuarios Premium. Los usuarios comunes visualizaran todos los productos disponibles, mientras que los usuarios Premium visualizaran todos los productos menos los suyos propios.
  -	Dentro de “La Tiendita” tendremos unos filtros…podría mejorar mucho esto pero lo hice para probar no mas, con poner los valores a buscar exactos funciona correctamente todo.(EJ: Si busca por Precio y se pone 1200, mostrara los productos que existan con precio 1200 únicamente).
  -	Una vez ingrese productos al carrito, dirige al checkout donde muestra 3 recuadros:
      o	Izquierda:
        	Muestra nombre y cantidad de los productos que agrego el usuario a su carrito
      o	Centro:
        	En caso que el usuario selecciono una cantidad de un producto mayor a la cantidad que tenga de stock existente, esos productos se mostraran en este espacio indicándole al usuario que esos productos quedaran en su carrito porque no hay stock. En caso de todos tener stock este cuadro estará vacío.
      o	Derecha:
        	Carrito final del usuario donde se muestra el nombre y cantidad de los productos que va a comprar.
-	Finalizada la compra muestra la pantalla final con la orden ya creada, donde indica nombre y cantidad de los productos.
  
# ProgramacionBackEnd - Guschar
