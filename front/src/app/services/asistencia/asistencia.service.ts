import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';
import { PersonaService } from '../persona/persona.service';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  Fecha = new Date();

  constructor(
    private http: HttpClient, private router: Router, private personaService: PersonaService
  ) {

  }

// ==================================================
// Carga las asistencias del cliente dado su IdPersona
// ==================================================
dameAsistencias(  IdPersona , desde = 0 ) {

  let url = URL_SERVICIOS + '/asistencias/' + desde + '/' + IdPersona;

  url += '?token=' + this.personaService.token;  // query
  return this.http.get( url );


}
// ==================================================
//  Marca la asistencia , recibe un IdPersona y un IdPlan
// ==================================================
marcarAsistenciaPersona( IdPersona: number = 0  ) {

  let url = URL_SERVICIOS + '/asistencias/cliente/' + IdPersona ;

  url += '?token=' + this.personaService.token;  // query

  return this.http.get( url );


}

}
