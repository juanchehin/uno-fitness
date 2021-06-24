import { Component, OnInit } from '@angular/core';
import { PersonaService } from 'src/app/services/service.index';

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.component.html',
  styleUrls: []
})
export class AcercaComponent implements OnInit {

  constructor(public personaService: PersonaService) { }

  ngOnInit() {
  }

}
