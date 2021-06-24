import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../../services/service.index';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Profesional } from 'src/app/models/profesional.model';

@Component({
  selector: 'app-editarprofesional',
  templateUrl: './editarprofesional.component.html',
  styles: []
})
export class EditarprofesionalComponent implements OnInit {

  forma: FormGroup;
  persona: any;
  sonIguales = false;
  banderaPass = false;

  Correo: string;
  Password: string;
  IdTipoDocumento: number;
  Apellidos: string;
  Nombres: string;
  Documento: string;
  Password2: string;
  Telefono: string;
  Sexo: number;
  Observaciones: string;
  Foto: string;
  FechaNac: string;
  Usuario: string;
  Calle: string;
  Piso: string;
  Departamento: string;
  Ciudad: string;
  Pais: string;
  Numero: number;
  IdRol: number;
  FechaAlta: any;
  FechaBaja: any;
  Estado: string;

  personaValor: string;
  imagenSubir: File;
  imagenTemp: string;
  cargando = true;
  private date: string;

  constructor(public personaService: PersonaService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
  this.cargarPersona();

  this.forma = new FormGroup({
    Correo: new FormControl( this.Correo , [Validators.required , Validators.email]),
    Password: new FormControl(null),  // Si se deja en NULL, en la BD se deja como estaba
    IdRol: new FormControl(null ),
    IdTipoDocumento: new FormControl('1', Validators.required ),
    Apellidos: new FormControl(null, Validators.required ),
    Nombres: new FormControl(null, Validators.required ),
    Documento: new FormControl( null , Validators.required ),
    Password2: new FormControl(null ),
    Telefono: new FormControl(null ),
    Sexo: new FormControl(null, Validators.required ),
    Observaciones: new FormControl(''),
    Foto: new FormControl(''),
    FechaNac: new FormControl(null),  // Si se deja en NULL, en la BD se deja como estaba
    Usuario: new FormControl(''),
    Calle: new FormControl(''),
    Piso: new FormControl(null),
    Departamento: new FormControl(''),
    Ciudad: new FormControl(''),
    Pais: new FormControl(''),
    Numero: new FormControl(null),
    Estado: new FormControl()
    // Condiciones: new FormControl( false )  // Para saber si se lleno bien el formulario
  });
  // { validators: this.compararContraseñas('Password' , 'Password2') });

  }
// ==================================================
//  Carga el profesional con sus datos para mostrar en el formulario
// ==================================================

cargarPersona() {

  this.date = this.activatedRoute.snapshot.paramMap.get('id');

  this.personaService.damePersona( this.date )
             .subscribe( (resp: any) => {

              this.persona = resp;

              this.IdRol = this.persona.IdRol;
              this.Correo = this.persona.Correo;
              this.Password =  this.persona.Password;
              this.IdTipoDocumento =  this.persona.IdTipoDocumento;
              this.Apellidos =  this.persona.Apellidos;
              this.Nombres = this.persona.Nombres;
              this.Documento = this.persona.Documento;
              this.Password2 =  this.persona.Password;
              this.Telefono =  this.persona.Telefono;
              this.Observaciones = this.persona.Observaciones;
              this.Sexo =  this.persona.Sexo;
              this.FechaNac =  this.persona.FechaNac;
              this.Usuario = this.persona.Usuario;
              this.Calle =  this.persona.Calle;
              this.Piso =  this.persona.Piso;
              this.Departamento = this.persona.Departamento || '';
              this.Ciudad =  this.persona.Ciudad;
              this.Pais =  this.persona.Pais;
              this.Numero =  this.persona.Numero;
              this.Estado = this.persona.EstadoPer;
              this.FechaBaja = this.persona.EstadoPer;
              this.FechaAlta = this.persona.FechaAlta;
              this.FechaBaja = this.persona.FechaBaja;

              this.cargando = false;

            });


}
// ==================================================
//        Controla que las contraseñas sean iguales
// ==================================================
compararContraseñas( campo1: string, campo2: string ) {

  return ( group: FormGroup ) => {

    const pass1 = group.controls[campo1].value;
    const pass2 = group.controls[campo2].value;

    if ( pass1 === pass2 ) {
      this.banderaPass = false;
      return;
    }
    this.banderaPass = true;
    return {
      sonIguales: true
    };

  };
}


// =================================================
//        actualiza ENTRENADOR
// ==================================================

actualizaProfesional( ) {
  if((this.forma.value.FechaNac === '00-00-0000') || (this.forma.value.FechaNac === null)){
    this.FechaNac = null;
  }

  if(this.forma.value.Password !== this.forma.value.Password2){
    this.banderaPass = true;
    Swal.fire({
      icon: 'error',
      title: 'Hubo un problema al actualizar',
      text: 'Las contraseñas deben coincidir',
    });
    return;
  }
  this.banderaPass = false;
  const profesional = new Profesional(
    this.forma.value.Correo = this.forma.value.Correo || this.Correo,
    this.forma.value.Password,
    this.forma.value.IdTipoDocumento = this.forma.value.IdTipoDocumento || this.IdTipoDocumento,
    this.forma.value.Apellidos = this.forma.value.Apellidos || this.Apellidos,
    this.forma.value.Nombres = this.forma.value.Nombres || this.Nombres,
    this.forma.value.Documento = this.forma.value.Documento || this.Documento,
    this.forma.value.Telefono = this.forma.value.Telefono || this.Telefono,
    this.forma.value.Sexo = this.forma.value.Sexo || this.Sexo,
    this.forma.value.FechaNac = this.forma.value.FechaNac || this.FechaNac,
    this.forma.value.Observaciones = this.forma.value.Observaciones || this.Observaciones,
    this.forma.value.Foto = this.forma.value.Foto || this.Foto,
    this.forma.value.Usuario = this.forma.value.Usuario || this.Usuario,
    this.forma.value.Calle = this.forma.value.Calle || this.Calle,
    this.forma.value.Piso = this.forma.value.Piso || this.Piso,
    this.forma.value.Departamento = this.forma.value.Departamento || this.Departamento,
    this.forma.value.Ciudad = this.forma.value.Ciudad || this.Ciudad,
    this.forma.value.Pais = this.forma.value.Pais || this.Pais,
    this.forma.value.Numero = this.forma.value.Numero || this.Numero,
    this.forma.value.IdRol = this.forma.value.IdRol || this.IdRol,
    this.forma.value.IdPersona = this.date,
    this.forma.value.Estado = this.forma.value.Estado || this.Estado
  );


  this.personaService.editarProfesional( profesional )
             .subscribe( (resp: any) => {

             if ( resp.Mensaje === 'Ok') {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Profesional actualizado',
                showConfirmButton: false,
                timer: 2000
              });
              this.router.navigate(['/mantenimiento/profesionales']);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Hubo un problema al actualizar',
                text: resp.Mensaje,
              });
            }
          });


}


}
