import { Component, OnInit } from '@angular/core';
import { MedicionService } from 'src/app/services/medicion/medicion.service';
import Swal from 'sweetalert2';
import { PlanService } from '../../services/plan/plan.service';
import { Plan } from '../../models/plan.models';

declare var swal: any;

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styles: []
})
export class PlanesComponent implements OnInit {

  planes: any;
  desde = 0;
  incluyeBajas = 0;

  totalPlanes = 0;
  cargando = true;

  constructor(
    public planService: PlanService,
    public medicionService: MedicionService
  ) { }

  ngOnInit() {
    this.cargarPlanes();

  }
// ==================================================
//        Modifica la bandera de incluye bajas profesionales
// ==================================================
  modificaBandera(  ) {

    if (this.incluyeBajas === 0) {
    this.incluyeBajas = 1;
    } else {
    this.incluyeBajas = 0;
    }
    this.cargarPlanes();
  }

// ==================================================
//        Carga los planes activos
// ==================================================

cargarPlanes() {

    this.planService.cargarPlanes( this.desde , this.incluyeBajas )
               .subscribe( (resp: any) => {

                this.totalPlanes = resp[1][0].cantPlanes;

                if (resp[1][0].cantPlanes === null) {
                  this.totalPlanes = 0;
                }

                this.planes = resp[0];
                this.cargando = false;

              });

  }

// ==================================================
//        Cambio de valor
// ==================================================

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;

    if ( desde >= this.totalPlanes ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarPlanes();

  }


// ==================================================
// Da de baja un plan
// ==================================================

eliminarPlan( plan: Plan ) {

  Swal.fire({
    title: '¿Esta seguro?',
    text: 'Esta a punto de dar de baja a "' + plan.Plan + '"',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar!'
  })
  .then( borrar => {

    if (borrar) {

      const parametro = plan.IdPlan.toString();

      this.planService.bajaPlan( parametro )
                .subscribe( (resp: any) => {
                    this.cargarPlanes();
                    if ( resp === 'Ok') {
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Plan dado de baja',
                        showConfirmButton: false,
                        timer: 2000
                      });
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Hubo un problema al eliminar',
                        text: resp.Mensaje,
                      });
                    }

                });
    }

  });

}


}
