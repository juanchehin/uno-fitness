import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/service.index';
import { PersonaService } from '../../services/persona/persona.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Medicion } from '../../models/medicion.model';
import { Persona } from 'src/app/models/persona.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../app.component.css']
})
export class HeaderComponent implements OnInit {

  IdPersona: string;
  medicion: Medicion[] = [];
  correoActual: string;
  cargando = true;
  id: number;
  menus: [];

  constructor(
    public personaService: PersonaService,
    public header: HeaderService,
    public router: Router ) {


    this.correoActual = localStorage.getItem('usuario'); // Cambiar esto y acceder desde el servicio, ver comentario de abajo
    // this.correoActual = this.personaService.usuario;
    this.comprobarLogueo();
    this.comprobarRole();
    this.menus = this.personaService.menu;
    this.IdPersona = this.personaService.personaId;

    }

  ngOnInit() {

    this.IdPersona = this.personaService.personaId;

  }
// ==================================================
//
// ==================================================
navegar() {
  this.IdPersona = this.personaService.personaId;
  if (this.personaService.IdRol === 2) {

    this.router.navigate(['/dashboard/', this.IdPersona]);
    // return true;
  } else {

    this.router.navigate(['/dashboard/', this.IdPersona]);
    // return false;
  }
}
// ==================================================
//        Funcion para comprobar el rol administrador: Idrol 2
// ==================================================
  comprobarRole() {
    this.correoActual = localStorage.getItem('usuario');

    if (this.personaService.IdRol === 2) {

      return true;
    } else {

      return false;
    }
  }

// ==================================================
//        Funcion para comprobar si esta logueado actualmente
// ==================================================
  comprobarLogueo() {
    this.correoActual = localStorage.getItem('usuario');

    if (this.personaService.estaLogueado()) {

      return false;
    } else {

      return true;
    }
  }

// ==================================================
//        Funcion para mostrar/ocultar boton 'INICIAR SESION' - VER POR QUE CADA VEZ QUE SE TECLEA EN EL LOGIN SE ACCEDE AQUI, RALENTIZA
// ==================================================
  paginaInicioSesion() {
    if (this.router.url === '/login') {
      return false;
    } else {
      return true;
    }
  }

}
