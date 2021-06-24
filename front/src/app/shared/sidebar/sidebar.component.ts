import { Component, OnInit } from '@angular/core';
import { PersonaService, HeaderService } from 'src/app/services/service.index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  correoActual: string;
  IdPersona: string;
  menus: [];

  constructor(
    public personaService: PersonaService,
    public header: HeaderService,
    public router: Router) {
      this.correoActual = localStorage.getItem('usuario');
      this.menus = this.personaService.menu;
      this.IdPersona = this.personaService.personaId;

    }

  ngOnInit() {
  }

}
