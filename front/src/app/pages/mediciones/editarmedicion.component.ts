import { Component, OnInit, Input} from '@angular/core';
import { Persona } from '../../models/persona.model';
import { PersonaService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Medicion } from 'src/app/models/medicion.model';
import { MedicionService } from '../../services/medicion/medicion.service';


@Component({
  selector: 'app-editarmedicion',
  templateUrl: './editarmedicion.component.html',
  styles: []
})
export class EditarmedicionComponent implements OnInit {

  forma: FormGroup;
  desde = 0;
  cargando = false;
  IdMedicion: number;
  medicion: any;
  persona = null;
  profesionales: any;
  Nombres: string;
  Apellidos: string;

  Altura: string;
  Peso: string;
  IMC: string;
  Musc: string;
  Grasa: string;
  GV: string;
  IdProfesional: number;
  IdPersona: string;
  Fecha: string;
  ApellidoProf: string;
  NombreProf: string;


  constructor(
    // public mediciones: MedicionesComponent,
    private personaService: PersonaService,
    private medicionService: MedicionService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.IdMedicion = Number(this.activatedRoute.snapshot.paramMap.get('IdMedicion'));
    this.IdPersona = this.activatedRoute.snapshot.paramMap.get('IdPersona');



  }

  ngOnInit() {
    this.cargarPersona();
    this.cargarMedicion();
    this.cargarProfesionales();

    this.forma = new FormGroup({
      Altura: new FormControl(this.Altura, Validators.required ),
      Peso: new FormControl(this.Peso, Validators.required),
      IMC: new FormControl(this.IMC, Validators.required ),
      Musc: new FormControl(this.Musc, Validators.required ),
      Grasa: new FormControl(this.Grasa, Validators.required ),
      GV: new FormControl(this.GV, Validators.required ),
      IdProfesional: new FormControl(this.IdProfesional, Validators.required )
    });

  }
// ==================================================
//  Carga una medicion con sus datos para mostrar en el formulario
// ==================================================

cargarMedicion() {

  this.cargando = true;


  this.medicionService.dameMedicion( this.IdMedicion.toString() )
             .subscribe( (resp: any) => {


              this.medicion = resp;
              this.Altura = this.medicion.Altura;
              this.Peso =  this.medicion.Peso;
              this.IMC =  this.medicion.IMC;
              this.Musc =  this.medicion.Musc;
              this.Grasa = this.medicion.Grasa;
              this.GV = this.medicion.GV;
              this.IdProfesional =  this.medicion.IdProfesional;
              this.IdMedicion =  this.medicion.IdMedicion;
              this.Fecha = this.medicion.Fecha;

              this.ApellidoProf = this.medicion.ApellidosProf;
              this.NombreProf = this.medicion.NombresProf;

              this.cargando = false;

            });


}

// ==================================================
//  Carga el cliente con sus datos para mostrar en el HTML
// ==================================================

cargarPersona() {

  this.cargando = true;

  this.personaService.damePersona( this.IdPersona )
             .subscribe( (resp: Persona) => {


              this.persona = resp;


              this.cargando = false;

            });


}

// ==================================================
// Carga todos los profesionales para seleccionar uno que realice la medicion
// ==================================================

cargarProfesionales() {

  this.cargando = true;

  this.personaService.cargarProfesionales(  )
             .subscribe( (resp: any) => {

              this.profesionales = resp[0];
              this.cargando = false;

            });

}

// =================================================
//        Actualiza Medicion
// ==================================================

actualizaMedicion( ) {

  const medicion = new Medicion(
    this.forma.value.Altura = this.forma.value.Altura || this.Altura,
    this.forma.value.Peso = this.forma.value.Peso || this.Peso,
    this.forma.value.IMC = this.forma.value.IMC || this.IMC,
    this.forma.value.Musc = this.forma.value.Musc || this.Musc,
    this.forma.value.Grasa = this.forma.value.Grasa || this.Grasa,
    this.forma.value.GV = this.forma.value.GV || this.GV,
    this.forma.value.IdProfesional = this.forma.value.IdProfesional || this.IdProfesional,
    this.forma.value.IdCliente = 0,
    this.forma.value.Fecha = '',
    this.forma.value.IdMedicion = this.forma.value.IdMedicion || this.IdMedicion


  );

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Medicion actualizada',
    showConfirmButton: false,
    timer: 2000
  });

  this.medicionService.editarMedicion( medicion )
             .subscribe( resp => {
              this.router.navigate(['/cliente/mediciones',  this.IdPersona ]);
              });

}

}
