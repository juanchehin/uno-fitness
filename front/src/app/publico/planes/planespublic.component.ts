

import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan/plan.service';
import { HttpClient } from '@angular/common/http';
import { Plan } from 'src/app/models/plan.models';

@Component({
  selector: 'app-planespublic',
  templateUrl: './planespublic.component.html',
  styleUrls: []
})
export class PlanesPublicComponent implements OnInit {
  desde = 0;
  totalPlanes = 0;
  planes: Plan;

  constructor(
    public http: HttpClient, public planesService: PlanService
  ) { }

  ngOnInit() {
    this.cargarPlanes();
  }

// ==================================================
//        Carga las planes activas para mostrar al publico
// ==================================================

cargarPlanes() {

  this.planesService.cargarPlanes( this.desde , 0 )
             .subscribe( (resp: any) => {

              this.totalPlanes = resp[1][0].cantPlanes;
              if (resp[1][0].maximo === null) {
                this.totalPlanes = 0;
              }
              this.planes = resp[0];

            });

}

controlExistenciaPlan() {
  if ( this.totalPlanes === 0 || this.totalPlanes === null) {
    return false;
  }
  return true;
}

}
