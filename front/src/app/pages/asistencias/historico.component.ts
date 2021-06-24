import { Component, OnInit } from '@angular/core';
import { Medicion } from 'src/app/models/medicion.model';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AsistenciaService, PersonaService } from 'src/app/services/service.index';
import { Persona } from 'src/app/models/persona.model';


@Component({
  selector: 'app-histotico',
  templateUrl: './histotico.component.html',
  styleUrls: []
})
export class HistoricoComponent implements OnInit {

  IdProfesinal: string;
  desde = 0;
  IdPersona: string;
  totalAsistencias = 0;
  asistencias: any;

  apellidos: any;
  nombres: any;

  // tslint:disable-next-line: max-line-length
  constructor(
    public asistenciaService: AsistenciaService,
    private activatedRoute: ActivatedRoute,
    public personaService: PersonaService
    ) {
      this.IdPersona = this.activatedRoute.snapshot.paramMap.get('IdPersona');

      this.cargarCliente();
      this.cargarAsistencias();

     }

  ngOnInit() {
  }


// ==================================================
//    Carga las asistencias listadas por fecha dado un id del cliente
// ==================================================

cargarAsistencias() {


  this.asistenciaService.dameAsistencias( this.IdPersona , this.desde  )
             .subscribe( (resp: any) => {


              this.asistencias = resp[0];
              this.totalAsistencias = resp[1][0].totalAsistencias;

            });

}
// ==================================================
//     Carga el cliente actual, para mostrar en el titulo
// ==================================================

cargarCliente() {

  this.personaService.damePersona( this.IdPersona )
             .subscribe( (resp: any) => {
              this.apellidos = resp.Apellidos;
              this.nombres = resp.Nombres;

            });

}


// ==================================================
//        Cambio de valor
// ==================================================

cambiarDesde( valor: number ) {
  const desde = this.desde + valor;

  if ( desde >= this.totalAsistencias ) {
    return;
  }

  if ( desde < 0 ) {

    return;
  }

  this.desde += valor;
  this.cargarAsistencias();

}


}
