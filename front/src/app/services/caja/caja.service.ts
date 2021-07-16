import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Egreso } from '../../models/egreso.model';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Ingreso } from 'src/app/models/ingreso.model';
import { PersonaService } from '../persona/persona.service';


@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(
    private http: HttpClient, private router: Router , private personaService: PersonaService
  ) {

  }

// ==================================================
//        Cargar transacciones - Peticion GET al server
// ==================================================
cargarTransacciones( desde: number = 0 , FechaInicio: any , FechaFin: any) {

  let url = URL_SERVICIOS + '/caja/' + desde + '/' + FechaInicio + '/' + FechaFin;
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.get( url,
    {
      headers: {
        token: this.personaService.token
      }
    }

  );
}

// ==================================================
//        Cargar transacciones - Peticion GET al server
// ==================================================
dameMovimientosClientes( id: string , desde: number) {

  let url = URL_SERVICIOS + '/caja/cliente/';
  url += 'array?id=' + id;
  url += '&desde=' + desde;

  return this.http.get( url );


}

// =======================================================================================================
// ===================== INGRESOS ========================================================================
// ========================================================================================================


// ==================================================
//        Nuevo ingreso
// ==================================================

crearIngreso( ingreso: Ingreso ) {

  let url = URL_SERVICIOS + '/caja/ingresos';
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.post(url,
    ingreso,
    {
      headers: {
        token: this.personaService.token
      }
    }
  );
}

// ==================================================
//        Cargar Ingresos - Peticion GET al server
// ==================================================
cargarIngresos( desde: number , FechaInicio: string , FechaFin: string) {

  let url = URL_SERVICIOS + '/caja/ingresos/listar/' + desde + '/' + FechaInicio + '/' + FechaFin;
  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.get( url,
    {
      headers: {
        token: this.personaService.token
      }
    }
  );

}


// =======================================================================================================
// ===================== EGRESOS ========================================================================
// ========================================================================================================


// ==================================================
//        Nuevo egreso
// ==================================================

crearEgreso( egreso: Egreso ) {

  let url = URL_SERVICIOS + '/caja/egresos';
  url += '?IdRol=' + this.personaService.IdRol;


  return this.http.post(url,
    egreso,
    {
      headers: {
        token: this.personaService.token
      }
    }
  );
}

// ==================================================
//        Cargar egresos - Peticion GET al server
// ==================================================
cargarEgresos( desde: number = 0 , FechaInicio: any , FechaFin: any ) {


  let url = URL_SERVICIOS + '/caja/egresos/listar/' + desde + '/' + FechaInicio + '/' + FechaFin;;

  url += '?IdRol=' + this.personaService.IdRol;

  return this.http.get( url,
    {
      headers: {
        token: this.personaService.token
      }
    }
  );

}
}
