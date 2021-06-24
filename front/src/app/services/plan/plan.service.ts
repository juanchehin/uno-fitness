import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Plan } from 'src/app/models/plan.models';
import { PersonaService } from '../persona/persona.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  plan: Plan;

  constructor(private http: HttpClient, private personaService: PersonaService) { }

// ==================================================
//    Marca la asistencia del dia de la fecha
// ==================================================

marcarAsistencia( IdAsistencia: number ) {

  let url = URL_SERVICIOS + '/planes/asistencia/' + IdAsistencia;
  url += '?token=' + this.personaService.token;  // query
  url += '&IdRol=' + this.personaService.IdRol;
  return this.http.get( url );

}

// ==================================================
//    Carga los planes activos dado un IdCliente
// ==================================================

cargarPlanesCliente( id: string ) {

  let url = URL_SERVICIOS + '/planes/cliente/' + id;
  url += '?token=' + this.personaService.token;  // query
  url += '&IdRol=' + this.personaService.IdRol;
  return this.http.get( url );

}

// ==================================================
//        Cargar planes - Peticion GET al server
// ==================================================

cargarPlanes( desde: number , incluyeBajas: number ) {

    const url = URL_SERVICIOS + '/planes/listar/' + desde + '/' + incluyeBajas;
    return this.http.get( url );

  }

// ==================================================
//        Cargar todos los planes activos
// ==================================================

cargarTodasPlanes( ) {

  const url = URL_SERVICIOS + '/planes/todas';
  return this.http.get( url );

}
// ==================================================
//        Crear plan
// ==================================================

crearPlan( plan: Plan) {

  let url = URL_SERVICIOS + '/planes';

  url += '?token=' + this.personaService.token;  // query
  url += '&IdRol=' + this.personaService.IdRol;

  return this.http.post(url , plan );

}

// ==================================================
//        Cargar plan
// ==================================================

cargarPlan( id: string ) {

  let url = URL_SERVICIOS + '/plan/' + id;
  url += '?token=' + this.personaService.token;  // query
  url += '&IdRol=' + this.personaService.IdRol;

  return this.http.get( url )
            .map( (resp: any) => resp.plan );

}


// ==================================================
//        Obtiene una plan de la BD
// ==================================================

damePlan( termino: string ) {

  let url = URL_SERVICIOS + '/planes/' + termino;
  url += '?token=' + this.personaService.token;  // query
  url += '&IdRol=' + this.personaService.IdRol;

  return this.http.get(url)
          .map( (resp: any) => resp[0]);
}

// ==================================================
//        Actualiza un plan de la BD
// ==================================================

actualizarPlan( plan: Plan, IdPlan: string ) {

  let url = URL_SERVICIOS + '/planes/actualiza/' + IdPlan;

  url += '?token=' + this.personaService.token;  // query
  url += '&IdRol=' + this.personaService.IdRol;

  return this.http.put(url , plan );
}


// ==================================================
//        Da de baja una plan
// ==================================================

bajaPlan( IdPlan: string ) {

  let url = URL_SERVICIOS + '/planes/baja/' + IdPlan;

  url += '?token=' + this.personaService.token;  // query
  url += '&IdRol=' + this.personaService.IdRol;

  return this.http.put(url , IdPlan );

}

}
