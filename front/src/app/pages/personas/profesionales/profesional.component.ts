import { Component, OnInit , HostBinding } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/service.index';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Profesional } from '../../../models/profesional.model';



@Component({
  selector: 'app-profesional',
  templateUrl: './profesional.component.html',
  styleUrls: []
})
export class ProfesionalComponent implements OnInit {

  uploadedFiles: Array < File > ;
  roles: any;
  forma: FormGroup;

  constructor(
    public personaService: PersonaService, private router: Router, private activatedRoute: ActivatedRoute
  ) {  }

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

  ngOnInit() {
    this.forma = new FormGroup({
      Correo: new FormControl( null , [Validators.required , Validators.email]),
      Password: new FormControl(null, Validators.required ),
      IdRol: new FormControl(null, Validators.required ),
      IdTipoDocumento: new FormControl('1', Validators.required ),
      Apellidos: new FormControl(null, Validators.required ),
      Nombres: new FormControl(null, Validators.required ),
      Documento: new FormControl(null, Validators.required ),
      Password2: new FormControl(null, Validators.required ),
      Telefono: new FormControl(null, Validators.required ),
      Sexo: new FormControl(null, Validators.required ),
      Observaciones: new FormControl(''),
      Foto: new FormControl(''),
      FechaNac: new FormControl(null, Validators.required  ),
      Usuario: new FormControl('', Validators.required),
      Calle: new FormControl(''),
      Piso: new FormControl(null),
      Departamento: new FormControl(''),
      Ciudad: new FormControl(''),
      Pais: new FormControl(''),
      Numero: new FormControl(null)
      // Condiciones: new FormControl( false )  // Para saber si se lleno bien el formulario
    },
    { validators: this.sonIguales('Password' , 'Password2') });

  }


// =================================================
//        ALTA DE ENTRENADOR
// ==================================================


  registrarProfesional() {

    if ( this.forma.invalid ) {
      return;
    }


    const profesional = new Profesional(
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
      this.forma.value.Foto,
      this.forma.value.Usuario,
      this.forma.value.Calle,
      this.forma.value.Piso,
      this.forma.value.Departamento,
      this.forma.value.Ciudad,
      this.forma.value.Pais,
      this.forma.value.Numero,
      this.forma.value.IdRol
    );

    this.personaService.crearProfesional( profesional )
              .subscribe( (resp: any) => {
                if ( resp.Mensaje === 'Ok') {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Profesional "' + this.forma.value.Usuario + '" cargado',
                    showConfirmButton: false,
                    timer: 2000
                  });
                  this.router.navigate(['/mantenimiento/profesionales']);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema al cargar',
                    text: resp.Mensaje,
                  });
                }
              });
  }
}

