import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Persona } from '../../models/persona.model';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import Swal from 'sweetalert2';
import { Cliente } from 'src/app/models/cliente.model';
import { Profesional } from '../../models/profesional.model';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  persona: Persona;
  personaValor: string;
  personaId: string;
  IdRol: any;
  token: string;
  usuario = '';
  menu: [];


  constructor(
    public http: HttpClient,
    public router: Router ) {
    this.cargarStorage();
    this.cargarPersonas();

  }

// ====================================================================================================================
// =========================================== LOGUEO =================================================================
// ====================================================================================================================

// ==================================================
//        Logueo de la persona
// ==================================================
login( persona: Persona ) {

  const url = URL_SERVICIOS + '/login';

  return this.http.post(url, persona)
        .map(
          ( resp: any ) => {
  if (resp.mensaje === 'Error de credenciales') {
    Swal.fire({
        icon: 'error',
        title: 'Error en el login',
        text:  'Error en el login'
    });
    return false;
  }
  this.IdRol = resp.IdRol;
  this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu, resp.IdRol);
  this.cargarStorage();

  return true;
  });
}

// ==================================================
//        Guarda la info en el localstorage
//  Guarda en el storage la informacion recibida por parametros
// ==================================================
guardarStorage( id: string, token: string, usuario: any, menu: any, IdRol: any ) {

  localStorage.setItem('id', id );
  localStorage.setItem('token', token );
  localStorage.setItem('menu', JSON.stringify(menu) );
  localStorage.setItem('usuario', usuario );

  this.IdRol = IdRol;
  this.token = token;
  this.personaId = id;
  this.usuario = usuario;
  this.menu = menu;

  this.actualizaEstadoCliente(this.personaId);
}

// ==================================================
// Carga la informacion almacenada en el localstorage a la informacion actual para que
// pueda ser accesada desde este servicio
// ==================================================
  cargarStorage() {

    if ((localStorage.getItem('token') === 'undefined') || (localStorage.getItem('token') === null)) {
      this.token = '';
      this.persona = null;
      this.personaId = null;
      this.menu = null;
    } else {
      const var1 = localStorage.getItem('token');
      this.token = var1;

      this.usuario = localStorage.getItem('usuario');

      const var3 = localStorage.getItem('id');

      this.personaId = var3;

      this.menu = JSON.parse( localStorage.getItem('menu') );
    }

  }

// ==================================================
//        Permite saber si un usuario esta logueado
// ==================================================
estaLogueado() {

  this.token = localStorage.getItem('token');
  if ((this.token === 'undefined') || (this.token === null)) {
    return false;
  } else {
    return( this.token.length > 5) ? true : false;

  }
}

// ==================================================
//        Renueva TOKEN
// ==================================================
  renuevaToken() {

    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get( url )
                .map( (resp: any) => {

                  this.token = resp.token;
                  localStorage.setItem('token', this.token );

                  return true;
                })
                .catch( err => {
                  this.router.navigate(['/login']);
                  Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No se pudo renovar token',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  // tslint:disable-next-line: deprecation
                  return Observable.throw( err );
                });


  }


// ==================================================
//   Actualiza los datos del usuario (Estado,Clases disponibles,mesesCredito,etc)
// ==================================================
actualizaEstadoCliente( IdPersona: string ) {
  const url = URL_SERVICIOS + '/login/control/estado/' + IdPersona;
  return this.http.get(url);
}
// ==================================================
//        Hace el logout del usuario
// ==================================================

logout() {
  this.persona = null;
  this.token = '';
  this.personaId = null;
  this.IdRol = null;
  this.usuario = null;
  this.menu = null;


  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('usuario');
  localStorage.removeItem('menu');



  this.router.navigate(['/login']);
}
// ====================================================================================================================
// =========================================== PERSONAS ===================================================================
// ====================================================================================================================

// ==================================================
//        Cargar persona - Peticion GET al server
// ==================================================
cargarPersonas( desde: number = 0 ) {

  const url = URL_SERVICIOS + '/personas?desde=' + desde;
  return this.http.get( url );

}


// ==================================================
// Devuelve los roles de la BD
// ==================================================

dameRoles( ) {

  let url = URL_SERVICIOS + '/personas/roles/listar';
  url += '?token=' + this.token;  // query

  return this.http.get(url)
          .map( (resp: any) => resp[0]);
}
// ==================================================
//        Da de baja una persona
// ==================================================

  bajaPersona( termino: string ) {

    let url = URL_SERVICIOS + '/personas/';
    url += 'array?token=' + this.token;  // query
    url += '&termino=' + termino;
    url += '&IdRol=' + this.IdRol;

    return this.http.put(url, termino)
            .map( (resp: any) => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Persona eliminada',
                showConfirmButton: false,
                timer: 2000
              });
            });
}

// ==================================================
//        Obtiene una persona de la BD
// ==================================================

damePersona( termino: string ) {

  const url = URL_SERVICIOS + '/personas/' + termino;

  return this.http.get(url)
          .map( (resp: any) => resp[0]);
}


// ==================================================
//        Busca una persona por termino
// ==================================================

  buscarPersona( termino: string ) {

    const url = URL_SERVICIOS + '/personas/busqueda/' + termino;

    return this.http.get(url)
            .map( (resp: any) => resp[0]);
  }

// ==================================================
//        Sube archivos - Peticion POST al server
// ==================================================

  uploadFile(formData) {
    const url = 'http://localhost:3000/api/personas/upload';
    return this.http.post(url, formData);
  }

// ==================================================
//        Actualizar persona - VERIFICAR SU FUNCIONAMIENTO - 05/02/20
// ==================================================

  actualizarPersona( persona: Persona) {
    let url = URL_SERVICIOS + '/persona/' + this.persona.Correo;

    url += '?token=' + this.token;
    url += '&IdRol=' + this.IdRol;

    return this.http.put(url, persona)
            .map( (resp: any) => {
              const personaDB: Persona = resp.usuario;

              const param = String(personaDB.IdPersona);

              if ( persona.IdPersona === this.persona.IdPersona ) {

                this.guardarStorage( param , this.token , this.usuario , this.menu , this.IdRol);
              }

              this.guardarStorage( param , this.token , this.usuario , this.menu , this.IdRol);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Usuario actualizado',
                showConfirmButton: false,
                timer: 2000
              });
            });
  }


// ====================================================================================================================
// =========================================== CLIENTES ===================================================================
// ====================================================================================================================

// ==================================================
//        Cargar clientes - Peticion GET al server
// ==================================================
cargarClientesPlanEstado( desde: number = 0 , IdPlan) {

  let url = URL_SERVICIOS + '/personas/clientes/plan/' + desde + '/' + IdPlan ;  // query

  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;

  return this.http.get( url );

}
// ==================================================
//  Activa un cliente (caso en que el cliente se dio de baja y desea reactivarse)
// ==================================================
activarCliente( IdPersona: any ) {

  let url = URL_SERVICIOS + '/personas/cliente/activar/' + IdPersona;

  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;


  return this.http.put(url , IdPersona );
}

// ==================================================
// Busca una persona en la BD dado su ID y el ID del plan al cual esta inscripto
// ==================================================

buscarClientePorPlan( Apellidos: string , Nombres: string , IdPlan: string  ) {

  const url = URL_SERVICIOS + '/personas/busqueda/plan/' + Apellidos + '/' + Nombres  + '/' + IdPlan;

  return this.http.get(url)
          .map( (resp: any) => resp[0]);
}

// ==================================================
//        Crear cliente
// ==================================================

crearCliente( cliente: Cliente ) {

  let url = URL_SERVICIOS + '/personas/cliente';

  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;


  return this.http.post(url , cliente );
}

// ==================================================
//        Elimina un cliente
// ==================================================

eliminarCliente( IdPersona ) {

  let url = URL_SERVICIOS + '/personas/cliente/eliminar/' + IdPersona;

  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;


  return this.http.delete(url );
}


// ==================================================
//        Editar Cliente
// ==================================================

editarCliente( cliente: Cliente ) {

  const id = cliente.IdPersona;

  let url = URL_SERVICIOS + '/personas/cliente/actualizar/' + id;

  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;


  return this.http.put(url , cliente );
}

// ====================================================================================================================
// =========================================== PROFESIONALES ===================================================================
// ====================================================================================================================

// ==================================================
//        Crear profesional
// ==================================================

crearProfesional( entrenador: Profesional ) {

  let url = URL_SERVICIOS + '/personas/profesional';

  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;


  return this.http.post(url , entrenador );
}

// ==================================================
//        Editar profesional
// ==================================================

editarProfesional( profesional: Profesional ) {

  const id = profesional.IdPersona;

  let url = URL_SERVICIOS + '/personas/profesional/actualizar/' + id;
  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;


  return this.http.put(url , profesional );
}

// ==================================================
//        Cargar profesionales - Peticion GET al server - Debe pasar por el ADMIN GUARD y el LOGIN GUARD
// ==================================================
cargarProfesionales(  ) {

    let url = URL_SERVICIOS + '/personas/profesionales';
    url += '?IdRol=' + this.IdRol;  // params
    return this.http.get( url );

}
// ==================================================
//        Cargar el personal del gimnasio
// ==================================================
cargarPersonal( desde: number , incluyeBajas: number ) {

  let url = URL_SERVICIOS + '/personas/personal/listar/' + desde + '/' + incluyeBajas;
  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;
  return this.http.get( url );

}
// ==================================================
//        Elimina un profesional
// ==================================================

eliminarProfesional( IdPersona ) {

  let url = URL_SERVICIOS + '/personas/profesional/eliminar/' + IdPersona;

  url += '?token=' + this.token;  // query
  url += '&IdRol=' + this.IdRol;


  return this.http.delete(url );
}

// ==================================================
//        Da de baja una persona
// ==================================================

bajaProfesional( termino: string ) {

  let url = URL_SERVICIOS + '/personas/';
  url += 'array?token=' + this.token;  // query
  url += '&termino=' + termino;
  url += '&IdRol=' + this.IdRol;

  return this.http.put(url, termino)
          .map( (resp: any) => {

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Profesional eliminado',
              showConfirmButton: false,
              timer: 2000
            });

          });

}


}
