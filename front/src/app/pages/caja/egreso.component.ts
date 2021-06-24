import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Persona } from 'src/app/models/persona.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from 'src/app/services/service.index';
import { CajaService } from 'src/app/services/service.index';
import { Egreso } from '../../models/egreso.model';

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrls: []
})
export class EgresoComponent implements OnInit {
  forma: FormGroup;
  cargando = true;
  persona: Persona[] = [];
  egreso: Egreso[];
  private IdPersona: string;



  // tslint:disable-next-line: max-line-length
  constructor(private activatedRoute: ActivatedRoute,
              public personaService: PersonaService,
              public cajaService: CajaService,
              private router: Router) { }


 ngOnInit() {

    this.IdPersona = this.personaService.personaId;
    this.forma = new FormGroup({
      Monto: new FormControl(null, Validators.required ),
      Cantidad: new FormControl(null, Validators.required),
      Detalle: new FormControl(null ),

    });

  }

// ==================================================
//        Nuevo egreso
// ==================================================
  nuevoEgreso() {

    if ( this.forma.invalid ) {
      return;
    }

    const egreso = new Egreso(
      this.forma.value.Monto,
      this.forma.value.Cantidad,
      this.forma.value.Detalle,
      this.IdPersona
    );



    this.cajaService.crearEgreso( egreso )
              .subscribe( (resp: any) => {
                if ( resp.Mensaje === 'Ok') {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Egreso cargado',
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
                return;
              });

}

}

