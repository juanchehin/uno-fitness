import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Persona } from 'src/app/models/persona.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from 'src/app/services/service.index';
import { CajaService } from 'src/app/services/service.index';

import { Ingreso } from '../../models/ingreso.model';
import { PlanService } from 'src/app/services/plan/plan.service';
import { Plan } from 'src/app/models/plan.models';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: []
})
export class IngresoComponent implements OnInit {
  forma: FormGroup;
  cargando = true;
  planes: Plan;
  cantPlanes = 0;
  persona: Persona[] = [];
  registros: Ingreso[] = [];
  private date: string;



  // tslint:disable-next-line: max-line-length
  constructor(private activatedRoute: ActivatedRoute, public personaService: PersonaService, public cajaService: CajaService, private router: Router,    public planService: PlanService
    ) { }

 // registros: number;

 ngOnInit() {
    this.cargarPersona();
    this.cargarPlanes();

//    this.cargarRegistro();


    this.forma = new FormGroup({
//      IdCliente: new FormControl(null, Validators.required ),
      // Monto: new FormControl(null, Validators.required ),
      IdPlan: new FormControl('1', Validators.required),  // plan, puede que no haya una
      Cantidad: new FormControl('1' , Validators.required),
      Detalle: new FormControl(null)

    });

  }
// ==================================================
//        Nuevo ingreso de caja
// ==================================================

  nuevaIngreso() {

    if ( this.forma.invalid ) {
      return;
    }

    const ingreso = new Ingreso(
      this.forma.value.IdPersona = this.activatedRoute.snapshot.paramMap.get('id'),
      // this.forma.value.Monto,
      this.forma.value.IdPlan,
      this.forma.value.Cantidad,
      this.forma.value.Detalle
    );

    this.cajaService.crearIngreso( ingreso )
              .subscribe( (resp: any) => {
                if ( resp.Mensaje === 'Ok') {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Ingreso cargado',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  this.router.navigate(['/cajas']);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema al cargar',
                    text: 'Contactese con el administrador',
                  });
                }
                this.router.navigate(['/cajas']);
              });

            }

// ==================================================
//        Carga de persona
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
//        Carga de planes
// ==================================================

cargarPlanes() {

  this.cargando = true;

  this.planService.cargarTodasPlanes( )
             .subscribe( (resp: any) => {

              this.planes = resp[0];

              this.cantPlanes = resp[1][0].maximo;

              this.cargando = false;

            });

}

}

