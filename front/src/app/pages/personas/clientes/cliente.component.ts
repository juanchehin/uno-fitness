import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/service.index';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { PlanService } from '../../../services/plan/plan.service';
import { Plan } from '../../../models/plan.models';



@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: []
})
export class ClienteComponent implements OnInit {

  uploadedFiles: string;

  forma: FormGroup;
  respuesta: any;
  planes: Plan;
  cargando = true;
  cantPlanes = 0;
  aparecer = false;
  parametro: any;


  constructor(
    public personaService: PersonaService,
    private router: Router,
    public planService: PlanService
  ) {
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
      Foto: new FormControl(''),
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

    },
    { validators: this.sonIguales('Password' , 'Password2') });

  }


// ==================================================
//        Controla que las contraseñas sean iguales
// ==================================================
sonIguales( campo1: string, campo2: string ) {

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
// ==================================================
//        Nuevo cliente
// ==================================================

  registrarCliente() {

    if ( this.forma.invalid ) {
      return;
    }

    const cliente = new Cliente(
      this.forma.value.Correo,
      this.forma.value.Password,
      this.forma.value.IdTipoDocumento,
      this.forma.value.Apellidos,
      this.forma.value.Nombres,
      this.forma.value.Documento,
      this.forma.value.Telefono,
      this.forma.value.Sexo,
      this.forma.value.FechaNac,
      this.forma.value.Observaciones,
      this.forma.value.Usuario,
      this.forma.value.Calle,
      this.forma.value.Piso,
      this.forma.value.Departamento,
      this.forma.value.Ciudad,
      this.forma.value.Pais,
      this.forma.value.Numero,
      this.forma.value.Objetivo,
      null,
      this.forma.value.Ocupacion,
      this.forma.value.Horario,
      null

    );



    this.personaService.crearCliente( cliente )
              .subscribe( (resp: any) => {

                  /*  Transformar resp.mensaje a JSON para que se pueda acceder*/
                  // tslint:disable-next-line: align
                  if ( resp.Mensaje === 'Ok') {
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Cliente cargado',
                      showConfirmButton: false,
                      timer: 2000
                    });
                    this.router.navigate(['/mantenimiento/clientes']);
                  } else {
                    if (resp.Mensaje === 'La persona ya se encuentra cargada') {
                        Swal.fire({
                          title: 'Persona ya cargada',
                          text: '¿Desea Reactivarlo?',
                          icon: 'info',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Si, activar'
                        })
                        .then( activar => {
                          this.parametro = resp.pIdPersona;
                          if (activar) {
                            this.activarCliente(this.parametro);
                            return;
                          }
                        });
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Hubo un problema al cargar',
                          text: resp.Mensaje
                        });
                      }
                    return;
                    // tslint:disable-next-line: align
                    }
                  });
    return;
  }

// ==================================================
//        Activar cliente
// ==================================================

activarCliente(IdPersona) {

  const parametro = JSON.stringify(IdPersona);

  this.personaService.activarCliente( parametro )
            .subscribe( (resp1: any) => {
                // this.cargarClientes();
                if ( resp1.Mensaje === 'Ok') {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Cliente Reactivado',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  this.router.navigate(['/mantenimiento/clientes']);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error al activar',
                    text: 'Contactese con el administrador',
                  });
                }
              });
}
// ==================================================
//        Carga de planes
// ==================================================

cargarPlanes() {

  this.planService.cargarTodasPlanes( )
             .subscribe( (resp: any) => {

              this.planes = resp[0];

              this.cantPlanes = resp[1][0].maximo;

              this.cargando = false;

            });

}



  }
