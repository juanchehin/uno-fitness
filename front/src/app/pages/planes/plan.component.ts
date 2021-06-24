import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/services/plan/plan.service';
import { Plan } from 'src/app/models/plan.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styles: []
})
export class PlanComponent implements OnInit {

  forma: FormGroup;
  cargando = true;



  constructor(private router: Router, public planesService: PlanService, public activatedRoute: ActivatedRoute) { 
    activatedRoute.params.subscribe( params => {

      const id = params.id;

      if ( id !== 'nuevo' ) {
      }

    });

  }

  ngOnInit() {
    this.forma = new FormGroup({
        IdPlan: new FormControl('0'),
        Cantidad: new FormControl(null, Validators.required),
        Plan: new FormControl(null, Validators.required),
        Precio: new FormControl(null, Validators.required ),
        Estado: new FormControl('A'),
        Descripcion: new FormControl(null )
      });
  }

// ==================================================
//        Crear plan
// ==================================================

  altaPlan() {

      if ( this.forma.invalid ) {
        return;
      }

      const plan = new Plan(
        this.forma.value.Plan,
        this.forma.value.Precio,
        this.forma.value.Cantidad,
        this.forma.value.Descripcion
      );

      this.planesService.crearPlan( plan )
                .subscribe( (resp: any) => {
                  if ( resp.Mensaje === 'Ok') {
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Plan cargado',
                      showConfirmButton: false,
                      timer: 2000
                    });
                    this.router.navigate(['/mantenimiento/planes']);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Hubo un problema al cargar',
                      text: 'Contactese con el administrador',
                    });
                  }
                  return;
                });


              }
}
