import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Medicion } from 'src/app/models/medicion.model';
import Swal from 'sweetalert2';
import { Router , ActivatedRoute } from '@angular/router';
import { MedicionService } from 'src/app/services/medicion/medicion.service';
import { Persona } from 'src/app/models/persona.model';
import { Profesional } from '../../models/profesional.model';
import { PersonaService } from 'src/app/services/service.index';



@Component({
  selector: 'app-medicion',
  templateUrl: './medicion.component.html',
  styleUrls: []
})
export class MedicionComponent implements OnInit {

  personas: Persona[] = [];
  profesionales: Profesional[] = [];
  persona: any = '';
  id: HTMLElement;
  selectedOperation: string;
  x: any;
  y: any;
  totalMediciones = 0;


  forma: FormGroup;
  desde = 0;

  totalRegistros = 0;
  cargando = true;

  private date: string;

  // tslint:disable-next-line: max-line-length
  constructor(
    public medicionService: MedicionService,
    private activatedRoute: ActivatedRoute,
    public personaService: PersonaService,
    private router: Router
    ) {
     }

  ngOnInit() {
    this.cargarProfesionalesCompleto();
    this.cargarPersona();

    this.date = this.activatedRoute.snapshot.paramMap.get('id');

    this.forma = new FormGroup({
      Altura: new FormControl('0', Validators.required ),
      Peso: new FormControl('0'),
      IMC: new FormControl(null, Validators.required ),
      Musc: new FormControl(null, Validators.required ),
      Grasa: new FormControl(null, Validators.required ),
      GV: new FormControl(null, Validators.required ),
      IdProfesional: new FormControl()
    });


  }
// ==================================================
//        Nueva medicion
// ==================================================

nuevaMedicion() {

  if ( this.forma.invalid ) {
    return;
  }


  const medicion = new Medicion(
    this.forma.value.Altura,
    this.forma.value.Peso,
    this.forma.value.IMC,
    this.forma.value.Musc,
    this.forma.value.Grasa,
    this.forma.value.GV,
    this.forma.value.IdProfesional,
    this.forma.value.IdPersona = this.persona.IdPersona
  );


  this.medicionService.crearMedicion( medicion )
            .subscribe( (resp: any) => {

              if ( resp.Mensaje === 'Ok') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Medicion cargada',
                  showConfirmButton: false,
                  timer: 2000
                });
                this.router.navigate(['/mantenimiento/clientes']);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Hubo un problema al cargar',
                  text: resp.Mensaje,
                });
              }
              this.router.navigate(['/mantenimiento/clientes']);
              return;
            });

}

// ==================================================
//        Total de mediciones de un cliente
// ==================================================
totalMedicion() {

  this.cargando = true;

  this.date = this.activatedRoute.snapshot.paramMap.get('id');

  this.medicionService.totalMedicion( this.date )
             .subscribe( (resp: any) => {

              this.totalMediciones = resp.Total;

              this.cargando = false;

            });

}



// ==================================================
// Carga todos los profesionales para seleccionar uno que es el que realiza la medicion
// ==================================================

cargarProfesionalesCompleto() {

  this.cargando = true;

  this.personaService.cargarProfesionales(  )
             .subscribe( (resp: any) => {

              this.profesionales = resp[0];

              this.cargando = false;

            });

}

// ==================================================
//        Carga de persona - Para mostrar nombre y apellido en el titulo
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

}
