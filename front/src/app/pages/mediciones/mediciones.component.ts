import { Component, OnInit } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { Medicion } from 'src/app/models/medicion.model';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MedicionService } from 'src/app/services/medicion/medicion.service';
import { Persona } from 'src/app/models/persona.model';
import { Profesional } from '../../models/profesional.model';
import { PersonaService } from 'src/app/services/service.index';


@Component({
  selector: 'app-mediciones',
  templateUrl: './mediciones.component.html',
  styleUrls: []
})
export class MedicionesComponent implements OnInit {

  persona: Persona[] = [];
  profesionales: Profesional[] = [];
  mediciones: Medicion;
  param: number;
  termino: number;
  IdProfesinal: string;
  IdPersona = '0';

  forma: FormGroup;
  desde = 0;
  date: string;


  totalRegistros = 0;
  cargando = true;

  // tslint:disable-next-line: max-line-length
  constructor(
    public medicionService: MedicionService,
    private activatedRoute: ActivatedRoute,
    public personaService: PersonaService
    ) {
      this.date = this.activatedRoute.snapshot.paramMap.get('id');
      this.termino = Number(  this.date );
      this.cargarMediciones();
      this.cargarCliente();


     }

  ngOnInit() {
  }


// ==================================================
//    Carga las mediciones por fecha dado un id
// ==================================================

cargarMediciones() {

  this.cargando = true;

  this.medicionService.dameMediciones( this.termino , this.desde  )
             .subscribe( (resp: any) => {

              // Setear el total de las mediciones en totalRegistros
              this.mediciones = resp[0];

              this.totalRegistros = resp[1][0].totalMediciones;

              this.cargando = false;

            });

}
// ==================================================
//     Carga el cliente actual, para mostrar en el titulo
// ==================================================

cargarCliente() {

  this.personaService.damePersona( this.date )
             .subscribe( (resp: any) => {

              this.persona = resp;

              this.cargando = false;

            });

}


// ==================================================
//        Cambio de valor
// ==================================================

cambiarDesde( valor: number ) {
  const desde = this.desde + valor;

  if ( desde >= this.totalRegistros ) {
    return;
  }

  if ( desde < 0 ) {

    return;
  }

  this.desde += valor;
  this.cargarMediciones();

}

// ==================================================
//
// ==================================================
comprobarRol() {
  this.IdPersona = this.personaService.personaId;
  if (this.personaService.IdRol === 2 || this.personaService.IdRol === 3) {
    return true;
  } else {
    return false;
  }
}

// ==================================================
//    Elimina una medicion dado su IdMedicion
// ==================================================

eliminarMedicion( IdMedicion: string ) {

  Swal.fire({
    title: '¿Esta seguro?',
    text: 'Esta a punto de borrar la medicion',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar!'
  })
  .then( borrar => {

    if (borrar) {

      this.medicionService.eliminarMedicion( IdMedicion )
                .subscribe( (resp: any) => {
                    if ( resp.Mensaje === 'Ok') {
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Medicion eliminada',
                        showConfirmButton: false,
                        timer: 2000
                      });
                      this.cargarMediciones();
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
