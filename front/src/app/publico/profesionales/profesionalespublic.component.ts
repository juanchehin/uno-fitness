import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../services/persona/persona.service';
import { Profesional } from '../../models/profesional.model';

@Component({
  selector: 'app-profesionalespublic',
  templateUrl: './profesionalespublic.component.html',
  styleUrls: []
})
export class ProfesionalesPublicComponent implements OnInit {

  desde = 0;
  totalProfesionales = 0;
  profesionales: Profesional;

  constructor(    public personaService: PersonaService
    ) { }

  ngOnInit() {
    this.cargarProfesionales();
  }

// ==================================================
//        Carga de profesionales
// ==================================================

cargarProfesionales() {

  this.personaService.cargarProfesionales(  )
             .subscribe( (resp: any) => {

              this.totalProfesionales = resp[1][0].maximo;

              if (resp[1][0].maximo === null) {
                this.totalProfesionales = 0;
              }

              this.profesionales = resp[0];

            });

}

controlExistenciaProfesional() {
  if ( this.totalProfesionales === 0 || this.totalProfesionales === null) {
    return false;
  }
  return true;
}

}
