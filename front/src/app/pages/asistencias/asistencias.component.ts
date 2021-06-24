import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan/plan.service';
import Swal from 'sweetalert2';
import { AsistenciaService } from 'src/app/services/service.index';


@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.component.html',
  styles: []
})
export class AsistenciasComponent implements OnInit {

  bandera = false;
  fechaActual = Date.now();

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public planService: PlanService,
    private asistenciaService: AsistenciaService
    ) {
      this.cargarPlanes();
    }

  date = '';
  cargando = true;
  totalPlanes = 0;
  planes = [];
  banderaPlan = false;
  banderaFecha = false;

  Plan: string;
  clasesDisponibles: any;
  mesesCredito: string;
  IdPlan: string;
  FechaUltimaAsistencia: any;
  hoy1: any;

  ngOnInit() {
    const hoy: any = new Date();
    const dd = String(hoy.getDate()).padStart(2, '0');
    const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = hoy.getFullYear();

    this.hoy1 = dd + '/' + mm + '/' + yyyy;
  }

// ==================================================
//  Carga el plan contratado por el cliente
// ==================================================

cargarPlanes() {

  this.date = this.activatedRoute.snapshot.paramMap.get('id');

  this.planService.cargarPlanesCliente( this.date )
             .subscribe( (resp: any) => {
              console.log('resp es : ', resp);
              this.IdPlan = resp[0][0].IdPlan;

              if ((resp[0][0].Mensaje !== 'Ok') || this.IdPlan === '1') {
                this.banderaPlan = true;
                this.Plan = 'Sin plan';
                this.clasesDisponibles = '0';
                this.mesesCredito = '0';
                return;
              }

              this.Plan = resp[0][0].Plan;
              this.mesesCredito = resp[0][0].MesesCredito;
              this.clasesDisponibles = resp[0][0].ClasesDisponibles;
              this.IdPlan = resp[0][0].IdPlan;
              this.FechaUltimaAsistencia = resp[1][0].FechaUltimaAsistencia;

              if (this.FechaUltimaAsistencia === this.hoy1) {
                this.banderaFecha = true;
                return;
              }
              this.cargando = false;

            });

}

// ==================================================
//  Comprueba las banderas para bloquear o no el boton
// ==================================================

comprobar( ) {

  if ( (this.clasesDisponibles === 0) || (this.banderaFecha === true) ) {
    return true;
  } else {
    return false;
  }

}
// ==================================================
//    Marca la asistencia de un determinado cliente dado un plan
// ==================================================

marcarAsistencia() {

 this.asistenciaService.marcarAsistenciaPersona(  Number(this.date)  )
             .subscribe( (resp: any) => {

              if ( resp.Mensaje === 'Ok') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Asistencia Marcada',
                  showConfirmButton: false,
                  timer: 2000
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Asistencias agotadas',
                  text: 'Clases agotadas',
                });
              }
              this.cargarPlanes();
              return;

            });

}

}
