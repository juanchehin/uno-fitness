import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/service.index';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  personas: Persona[] = [];
  persona: any = '';
  cargando = false;
  date: string;
  menus: [];

  IdPersona = '0';

  constructor(
    private activatedRoute: ActivatedRoute,
    private personaService: PersonaService,
    private router: Router
    ) { }
  ngOnInit() {
    this.cargarPersona();
    this.menus = this.personaService.menu;

  }

// ==================================================
//        Carga de persona - Para mostrar nombre y apellido en el titulo
// ==================================================

cargarPersona() {

  this.cargando = true;

  this.date = this.activatedRoute.snapshot.paramMap.get('id');

  this.personaService.damePersona( this.date )
             .subscribe( (resp: any) => {

              this.persona = resp;

              this.cargando = false;

            });

}

// ==================================================
//
// ==================================================
comprobarRol() {
  this.IdPersona = this.personaService.personaId;
  if (this.personaService.IdRol === 1) {
    return false;
  } else {
    return true;
  }
}

}
