import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Medicion } from '../../models/medicion.model';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Persona } from 'src/app/models/persona.model';
import { PersonaService } from '../persona/persona.service';


@Injectable({
  providedIn: 'root'
})
export class MedicionService {

  medicion: Medicion;
  persona: Persona;

  constructor(
    public http: HttpClient, public router: Router, public personaService: PersonaService
  ) {

  }

// ==================================================
//    Carga el listado de las mediciones de un cliente , dado un ID
// ==================================================

dameMediciones(id: number, desde: number) {

  let url = URL_SERVICIOS + '/mediciones/listar/' + id + '/' + desde;
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.get(url,
    {
      headers: {
        token: this.personaService.token
      }
    }).map( (resp: any) => resp);

}

// ==================================================
//    Carga una mediciono dado un IdMedicion
// ==================================================

dameMedicion( IdMedicion: string) {

  let url = URL_SERVICIOS + '/mediciones/' + IdMedicion;
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.get(url,
    {
      headers: {
        token: this.personaService.token
      }
    }).map(
          (resp: any) => {
          return resp;
    });
}
// ==================================================
//        Crea una nueva medicion
// ==================================================

  crearMedicion(medicion: Medicion) {

    let url = URL_SERVICIOS + '/mediciones';
    url += '?IdRol=' + this.personaService.IdRol;

    return this.http.post(url,
      medicion,
      {
        headers: {
          token: this.personaService.token
        }
      }
      );
  }
// ==================================================
//        Edita una medicion
// ==================================================
editarMedicion(medicion: Medicion) {

  let url = URL_SERVICIOS + '/mediciones/actualizar';

  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.put(url,
          medicion,
          {
            headers: {
              token: this.personaService.token
            }
          }
    );

}
// ==================================================
//        totalMedicion
// ==================================================

totalMedicion( termino: string) {

  let url = URL_SERVICIOS + '/mediciones/' + termino;
  url += '?token=' + this.personaService.token;  // query
  url += '&IdRol=' + this.personaService.IdRol;

  return this.http.get(url,
    {
      headers: {
        token: this.personaService.token
      }
    }
    ).map( (resp: any) => resp[0]);

}

// ==================================================
//        Elimina una medicion dado su ID
// ==================================================

eliminarMedicion( IdMedicion ) {

  let url = URL_SERVICIOS + '/mediciones/eliminar/' + IdMedicion;
  url += '?IdRol=' + this.personaService.IdRol;


  return this.http.delete(url,
    {
      headers: {
        token: this.personaService.token
      }
    }
  );
}

}
