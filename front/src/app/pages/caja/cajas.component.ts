import { Component, OnInit } from '@angular/core';
import { CajaService } from '../../services/service.index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styleUrls: []
})
export class CajasComponent implements OnInit {

  private date: string;
// transacciones: Transaccion[] = [];
  desde = 0;

  FechaInicio = new Date(2000, 1 , 1);
  FechaFin = new Date(Date.now());
  controlFechas = false;

  totalTransacciones = 0;
  transacciones: Array < any > ;

  cargando = true;
  ingresoEgreso = 'ingreso';

  constructor(
    public cajaService: CajaService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  registros: number;

  ngOnInit() {

    this.cargarTransacciones();
  }

// ==================================================
// Detecta los cambios en la fecha de inicio
// ==================================================
cambiosFechaInicio(nuevaFechaInicio) {
  if (nuevaFechaInicio > this.FechaFin) {
    this.controlFechas = true;
  } else {
    this.controlFechas = false;
  }

}

// ==================================================
// Detecta los cambios en la fecha de fin
// ==================================================
cambiosFechaFin(nuevaFechaFin) {

  if (nuevaFechaFin < this.FechaInicio) {
    this.controlFechas = true;
  } else {
    this.controlFechas = false;
  }
}

// ==================================================
//    Formatea la fecha a yyyy-mm-dd
// ==================================================

formatDate(date) {
    // tslint:disable-next-line: one-variable-per-declaration
    let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    // tslint:disable-next-line: prefer-const
    day = '' + d.getDate(),
    // tslint:disable-next-line: prefer-const
    year = d.getFullYear();

    // Agrego los ceros a la izquierda
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
}


// ==================================================
//        Carga de transacciones
// ==================================================

cargarTransacciones() {

  const pFechaInicio  = this.formatDate(this.FechaInicio);
  const pFechaFin = this.formatDate(this.FechaFin);

  this.cajaService.cargarTransacciones( this.desde, pFechaInicio , pFechaFin )
             .subscribe( (resp: any) => {


              // Controlar que el cliente exista AQUI , ver como se puede capturar el mensaje enviado desde el SQL

              this.totalTransacciones = resp[1][0].maximo;

              this.transacciones = resp[0];

              // Hacer control de cuando devuelve menos de 5
              // tslint:disable-next-line: prefer-for-of
              for ( let i = 0; i < this.transacciones.length; i++) {
                if (this.transacciones[i].IdTransaccion !== null ) {
                  this.transacciones[i].Tipo = 'Egreso';
                  this.transacciones[i].Apellidos = '-';
                  this.transacciones[i].Nombres = '-';
                } else {
                  this.transacciones[i].Tipo = 'Ingreso';

                }
              }

              if (resp[1][0].maximo === undefined || resp[1][0].maximo === null) {
                this.totalTransacciones = 0;
              }

              this.cargando = false;

            });

}

// ==================================================
//        Cambio de valor
// ==================================================

cambiarDesde( valor: number ) {

  const desde = this.desde + valor;

  if ( desde >= this.totalTransacciones ) {
    return;
  }

  if ( desde < 0 ) {
    return;
  }

  this.desde += valor;
  this.cargarTransacciones();

}

// ==================================================
//    Funcion para recargar el listado
// ==================================================

refrescar() {
  // Reseteo 'desde' a cero
  this.desde = 0;
  this.cargarTransacciones();
}


}
