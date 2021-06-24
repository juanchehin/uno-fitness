import { Component, OnInit } from '@angular/core';
import { Profesional } from '../../../models/profesional.model';
import { PersonaService } from '../../../services/service.index';
import { MedicionService } from 'src/app/services/medicion/medicion.service';
import Swal from 'sweetalert2';

declare var swal: any;

@Component({
  selector: 'app-profesionales',
  templateUrl: './profesionales.component.html',
  styles: []
})
export class ProfesionalesComponent implements OnInit {

  profesionales: Profesional[] = [];
  desde = 0;
  incluyeBajas = 0;

  totalProfesionales = 0;
  cargando = true;

  constructor(
    public personaService: PersonaService,
    public medicionService: MedicionService
  ) { }

  ngOnInit() {
    this.cargarPersonal();

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
    this.cargarPersonal();
  }

// ==================================================
//        Carga el personal activo
// ==================================================

  cargarPersonal() {

    this.cargando = true;

    this.personaService.cargarPersonal( this.desde , this.incluyeBajas )
               .subscribe( (resp: any) => {

                this.totalProfesionales = resp[1][0].cantProf;

                if (resp[1][0].cantProf === null) {
                  this.totalProfesionales = 0;
                }

                this.profesionales = resp[0];

                this.cargando = false;

              });

  }

// ==================================================
//        Cambio de valor
// ==================================================

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;

    if ( desde >= this.totalProfesionales ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarPersonal();

  }


// ==================================================
//    Elimina un profesional dado su IdPersona
// ==================================================

eliminarProfesional( profesional: Profesional ) {

  Swal.fire({
    title: '¿Esta seguro?',
    text: 'Esta a punto de dar de baja a ' + profesional.Nombres + ' ' + profesional.Apellidos,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar!'
  })
  .then( borrar => {

    if (borrar) {

      const parametro = profesional.IdPersona.toString();

      this.personaService.eliminarProfesional( parametro )
                .subscribe( (resp: any) => {
                    this.cargarPersonal();
                    if ( resp.mensaje === 'Ok') {
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Profesional dado de baja',
                        showConfirmButton: false,
                        timer: 2000
                      });
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Hubo un problema al eliminar',
                        text: 'Contactese con el administrador',
                      });
                    }

                });
    }

  });

}


}
