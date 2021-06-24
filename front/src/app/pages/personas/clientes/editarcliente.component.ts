import { Component, OnInit } from '@angular/core';
import { Persona } from '../../../models/persona.model';
import { PersonaService } from '../../../services/service.index';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';

@Component({
  selector: 'app-editarcliente',
  templateUrl: './editarcliente.component.html',
  styles: []
})
export class EditarclienteComponent implements OnInit {

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
  FechaNac: string;
  Usuario: string;
  Objetivo: string;
  Ocupacion: string;
  Horario: string;
  Calle: string;
  Piso: string;
  Departamento: string;
  Ciudad: string;
  Pais: string;
  Numero: number;
  Estado: string;
  FechaInicio: string;

  personaValor: string;
  imagenSubir: File;
  imagenTemp: string;
  cargando = true;
  private date: string;

  constructor(public personaService: PersonaService, private activatedRoute: ActivatedRoute, private router: Router) {

    this.cargarCliente();


  }

  ngOnInit() {

    this.forma = new FormGroup({
        // IdPersona: new FormControl(),
        IdRol: new FormControl('0', Validators.required ),
        IdTipoDocumento: new FormControl(1, Validators.required ),
        Apellidos: new FormControl(null, Validators.required ),
        Nombres: new FormControl(null, Validators.required ),
        Documento: new FormControl(null, Validators.required ),
        Password: new FormControl(null, Validators.required ),
        Password2: new FormControl(null, Validators.required ),
        Telefono: new FormControl(null ),
        Sexo: new FormControl(null, Validators.required ),
        Observaciones: new FormControl(''),
        FechaNac: new FormControl(null, Validators.required  ),
        Correo: new FormControl( null , [Validators.required , Validators.email ]),
        Usuario: new FormControl(''),
        Calle: new FormControl(null),
        Piso: new FormControl(null),
        Departamento: new FormControl(''),
        Ciudad: new FormControl(''),
        Pais: new FormControl(''),
        Numero: new FormControl(null),
        Objetivo: new FormControl(null),
        // IdPlan: new FormControl(null),
        Ocupacion: new FormControl(null),
        Horario: new FormControl(null)
  //      EstadoCliente: new FormControl(null)

      });
      // { validators: this.compararContraseñas('Password' , 'Password2') });


  }
// ==================================================
//  Carga el cliente con sus datos para mostrar en el formulario
// ==================================================

cargarCliente() {

  this.date = this.activatedRoute.snapshot.paramMap.get('id');

  this.personaService.damePersona( this.date )
             .subscribe( (resp: Persona) => {


              this.persona = resp;

              this.Correo = this.persona.Correo;
              this.Password =  this.persona.Password;
              this.IdTipoDocumento =  this.persona.IdTipoDocumento;
              this.Apellidos =  this.persona.Apellidos;
              this.Nombres = this.persona.Nombres;
              this.Documento = this.persona.Documento;
              this.Password2 =  this.persona.Password;
              this.Telefono =  this.persona.Telefono;
              this.Observaciones = this.persona.Observaciones;
              this.FechaNac =  this.persona.FechaNac;
              this.Usuario = this.persona.Usuario;
              this.Objetivo = this.persona.Objetivo;
              this.Ocupacion = this.persona.Ocupacion;
              this.Horario = this.persona.Horario;
              this.Calle =  this.persona.Calle;
              this.Piso =  this.persona.Piso;
              this.Departamento = this.persona.Departamento;
              this.Ciudad =  this.persona.Ciudad;
              this.Pais =  this.persona.Pais;
              this.Numero =  this.persona.Numero;
              this.Sexo = this.persona.Sexo;
              this.Estado = this.persona.EstadoCli;
              this.FechaInicio = this.persona.FechaInicio;
              this.FechaNac = this.persona.FechaNac;

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
      return null;
    }

    return {
      sonIguales: true
    };

  };
}


// =================================================
//        Actualiza Cliente
// ==================================================

actualizaCliente( ) {

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

  const cliente = new Cliente(
    this.forma.value.Correo = this.forma.value.Correo || this.Correo,
    this.forma.value.Password,
    // this.forma.value.IdPersona = 0,
    // this.forma.value.IdRol,
    this.forma.value.IdTipoDocumento = this.forma.value.IdTipoDocumento || this.IdTipoDocumento,
    this.forma.value.Apellidos = this.forma.value.Apellidos || this.Apellidos,
    this.forma.value.Nombres = this.forma.value.Nombres || this.Nombres,
    this.forma.value.Documento = this.forma.value.Documento || this.Documento,
    this.forma.value.Telefono = this.forma.value.Telefono || this.Telefono,
    this.forma.value.Sexo = this.forma.value.Sexo || this.Sexo,
    this.forma.value.FechaNac = this.forma.value.FechaNac || this.FechaNac,
    this.forma.value.Observaciones = this.forma.value.Observaciones || this.Observaciones,
    this.forma.value.Usuario = this.forma.value.Usuario || this.Usuario,
    this.forma.value.Calle = this.forma.value.Calle || this.Calle,
    this.forma.value.Piso = this.forma.value.Piso || this.Piso,
    this.forma.value.Departamento = this.forma.value.Departamento || this.Departamento,
    this.forma.value.Ciudad = this.forma.value.Ciudad || this.Ciudad,
    this.forma.value.Pais = this.forma.value.Pais || this.Pais,
    this.forma.value.Numero = this.forma.value.Numero || this.Numero,
    this.forma.value.Objetivo = this.forma.value.Objetivo || this.Objetivo,
    this.forma.value.ClasesDisponibles = 0,    // No se muestra en el Formulario
    this.forma.value.Ocupacion = this.forma.value.Ocupacion || this.Ocupacion,
    this.forma.value.Horario = this.forma.value.Horario || this.Horario,
    // this.forma.value.IdRol = 2,
    this.forma.value.IdPersona = Number(this.date)

  );

  this.personaService.editarCliente( cliente )
             .subscribe( (resp: any) => {

              if ( resp.Mensaje === 'Ok') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Cliente actualizado',
                  showConfirmButton: false,
                  timer: 2000
                });
                this.router.navigate(['/mantenimiento/clientes']);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al actualizar',
                  text: resp.Mensaje,
                });
                return;
              }
             });
}


}
