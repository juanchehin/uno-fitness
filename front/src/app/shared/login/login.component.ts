import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PersonaService, HeaderService } from '../../services/service.index';
import { Persona } from '../../models/persona.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(
    public personaService: PersonaService,
    public router: Router,
    public headerService: HeaderService
    ) { }
  ngOnInit() {
    this.personaService.logout();
    // this.personaService.actualizaEstadoCliente();
  }

// ==================================================
//  Proceso de LOGUEO
// ==================================================
  ingresar(forma: NgForm) {



    if ( forma.invalid ) {

      return;
    }

    const persona = new Persona(
      forma.value.email,
      forma.value.password
      );

    this.personaService.login(persona)
      .subscribe(resp => {

        if ( resp === true) {
          this.router.navigate(['/principal']);
        }
      });

  }

}
