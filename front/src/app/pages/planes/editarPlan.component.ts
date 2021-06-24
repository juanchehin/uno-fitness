import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Plan } from 'src/app/models/plan.models';
import { PlanService } from '../../services/plan/plan.service';

@Component({
  selector: 'app-editarplan',
  templateUrl: './editarplan.component.html',
  styles: []
})
export class EditarPlanComponent implements OnInit {

  forma: FormGroup;
  plan: Plan[] = [];

  personaValor: string;
  imagenSubir: File;
  imagenTemp: string;
  cargando = true;
  private date: string;  // IdPlan

  Plan: string;
  CantClases: string;
  Descripcion: string;
  EstadoPlan: string;
  Precio: string;

  constructor(private planService: PlanService,
              private activatedRoute: ActivatedRoute,
              private router: Router
    ) {

  }

  ngOnInit() {
    this.cargarPlan();

    this.forma = new FormGroup({
      Plan: new FormControl(),
      Precio: new FormControl(),
      Descripcion: new FormControl(),
      CantClases: new FormControl(),
      EstadoPlan: new FormControl()
    });
  }


// ==================================================
//  Carga el plan con sus datos
// ==================================================

cargarPlan() {

  this.date = this.activatedRoute.snapshot.paramMap.get('id');

  this.planService.damePlan( this.date )
             .subscribe( (resp: any) => {



              this.CantClases = resp.CantClases;
              this.Descripcion = resp.Descripcion;
              this.EstadoPlan = resp.EstadoPlan;
              this.Plan = resp.Plan;
              this.Precio = resp.Precio;
              this.cargando = false;

            });

}
// ==================================================
//        Actualizo el plan
// ==================================================
actualizarPlan(){

  const plan = new Plan(
    this.forma.value.Plan,
    this.forma.value.Precio,
    this.forma.value.CantClases,
    this.forma.value.Descripcion,
    this.forma.value.IdPlan  || this.date,
    this.forma.value.EstadoPlan || this.EstadoPlan

  );

  this.planService.actualizarPlan( plan , this.date)
              .subscribe( (resp: any) => {

                if ( resp.Mensaje === 'Ok') {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Plan actualizado',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  this.router.navigate(['/mantenimiento/planes']);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema al actualizar',
                    text: 'Contactese con el administrador',
                  });
                  return;
                }
              });


}

}
