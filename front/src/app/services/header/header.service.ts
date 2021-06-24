import { Injectable } from '@angular/core';
import { PersonaService } from '../persona/persona.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  menu: any[];

  constructor(
    public personaService: PersonaService,
  ) { }

  cargarMenu() {
    this.menu = this.personaService.menu;
  }
}
