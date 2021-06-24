import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CajaService } from '../../services/service.index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: []
})
export class IngresosComponent implements OnInit {

// transacciones: Transaccion[] = [];
  desde = 0;

  FechaInicio = new Date(2000, 1 , 1);
  FechaFin = new Date(Date.now());
  controlFechas = false;

  totalIngresos = 0;
  ingresos: Array < any > ;

  cargando = true;

  constructor(
    public cajaService: CajaService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.cargarIngresos();
  }
// ==================================================
// Detecta los cambios en el select de los planes y carga IdPlan en 'nuevoValor'
// ==================================================
cambiosFechaInicio(nuevaFechaInicio) {

  if (nuevaFechaInicio > this.FechaFin) {
    // this.FechaInicio = nuevaFechaInicio;
    this.controlFechas = true;
  } else {
    this.controlFechas = false;
  }

}

// ==================================================
// Detecta los cambios en el select de los planes y carga IdPlan en 'nuevoValor'
// ==================================================
cambiosFechaFin(nuevaFechaFin) {

  if (nuevaFechaFin < this.FechaInicio) {
    // this.FechaInicio = nuevaFechaFin;
    this.controlFechas = true;
  } else {
    this.controlFechas = false;
  }
  // this.FechaFin = nuevaFechaFin;

}

// ==================================================
//    Formatea la fecha a yyyy-mm-dd
// ==================================================

formatDate(date) {
    // tslint:disable-next-line: one-variable-per-declaration
    let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    // tslint:disable-next-line: prefer-const
    year = d.getFullYear();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
}

// ==================================================
//        Carga de ingresos
// ==================================================

cargarIngresos() {

  const pFechaInicio  = this.formatDate(this.FechaInicio);
  const pFechaFin = this.formatDate(this.FechaFin);

  this.cargando = true;

  this.cajaService.cargarIngresos( this.desde , pFechaInicio , pFechaFin)
             .subscribe( (resp: any) => {
              // Controlar que el cliente exista AQUI , ver como se puede capturar el mensaje enviado desde el SQL

              this.totalIngresos = resp[1][0].maximo;

              this.ingresos = resp[0];

              if (resp[1][0].maximo === undefined || resp[1][0].maximo === null) {
                this.totalIngresos = 0;
              }

              this.cargando = false;

            });

}

// ==================================================
//        Cambio de valor
// ==================================================

cambiarDesde( valor: number ) {

  const desde = this.desde + valor;

  if ( desde >= this.totalIngresos ) {
    return;
  }

  if ( desde < 0 ) {
    return;
  }

  this.desde += valor;
  this.cargarIngresos();

}


// ==================================================
//        Mensaje al presionar un boton
// ==================================================
mensajeIngreso() {
  Swal.fire({
    position: 'top-end',
    icon: 'info',
    title: 'Seleccione el cliente',
    showConfirmButton: false,
    timer: 2000
  });
}

// ==================================================
//    Funcion para recargar el listado
// ==================================================

refrescar() {
  // Reseteo 'desde' a cero
  this.desde = 0;
  this.cargarIngresos();
}

}
