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
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.get(
    url,
    {
      headers: {
        token: this.personaService.token
      }
    }
);


}

// ==================================================
//    Carga los planes activos dado un IdCliente
// ==================================================

cargarPlanesCliente( id: string ) {

  let url = URL_SERVICIOS + '/planes/cliente/' + id;
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.get(
    url,
    {
      headers: {
        token: this.personaService.token
      }
    }
);


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
  url += '?IdRol=' + this.personaService.IdRol;
  return this.http.post(
    url,
    plan,
    {
      headers: {
        token: this.personaService.token
      }
    }
);

}

// ==================================================
//        Obtiene un plan
// ==================================================

damePlan( termino: string ) {

  let url = URL_SERVICIOS + '/planes/' + termino;
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.get(
    url,
    {
      headers: {
        token: this.personaService.token
      }
    }
).map( (resp: any) => resp[0] );
}

// ==================================================
//        Actualiza un plan de la BD
// ==================================================

actualizarPlan( plan: Plan, IdPlan: string ) {

  let url = URL_SERVICIOS + '/planes/actualiza/' + IdPlan;
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.put(
    url,
    plan,
    {
      headers: {
        token: this.personaService.token
      }
    }
);
}


// ==================================================
//        Da de baja una plan
// ==================================================

bajaPlan( IdPlan: string ) {

  let url = URL_SERVICIOS + '/planes/baja/' + IdPlan;
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.post(
    url,
    IdPlan,
    {
      headers: {
        token: this.personaService.token
      }
    }
);

}

}
