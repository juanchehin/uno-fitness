import { Component, OnInit } from '@angular/core';
import { Profesional } from '../../../models/profesional.model';
import { PersonaService } from '../../../services/service.index';
import Swal from 'sweetalert2';
import { MedicionService } from 'src/app/services/medicion/medicion.service';
import { Cliente } from 'src/app/models/cliente.model';
import { AsistenciaService } from '../../../services/asistencia/asistencia.service';
import { Asistencia } from '../../../models/asistencia.model';
import { PlanService } from 'src/app/services/plan/plan.service';
import { Plan } from 'src/app/models/plan.models';

declare var swal: any;

@Component({
  selector: 'app-personas',
  templateUrl: './clientes.component.html',
  styles: []
})
export class ClientesComponent implements OnInit {

  personas: Profesional[] = [];
  clientes: Cliente[] = [];
  asistencias: Asistencia[] = [];
  desde = 0;
  totalAsistencias = true;
  ClasesDisponibles = 0;

  planes: Plan;
  cantPlanes = 0;

  totalClientes = 0;
  cargando = true;
  planSeleccionado = 0;  // Parametro seleccionado en el SELECT de planes
  estadoSeleccionado = 'N';  // Parametro seleccionado en el SELECT de los estados de clientes


  constructor(
    public personaService: PersonaService,
    public medicionService: MedicionService,
    public asistenciaService: AsistenciaService,
    public planService: PlanService
  ) {
    this.planSeleccionado = 0;
   }

  ngOnInit() {
    this.cargarClientes();
    this.cargarPlanes();

  }



// ==================================================
// Detecta los cambios en el select de los planes y carga IdPlan en 'nuevoValor'
// ==================================================
cambios(nuevoValor) {

    this.planSeleccionado = nuevoValor;

    this.cargarClientes();
}

// ==================================================
// Detecta los cambios en el select de los clientes activos/inactivos
// ==================================================
cambiosEstado(nuevoEstado) {

  this.estadoSeleccionado = nuevoEstado;


  this.cargarClientes();

}

// ==================================================
// Carga de clientes y filtra por dados de baja/alta/todos
// Ademas filtra por plan
// 0 : Dados de alta
// -1 : Todos
// ==================================================

  cargarClientes() {

    const buscarApellido: HTMLInputElement = document.getElementById('buscarApellidos') as HTMLInputElement;
    buscarApellido.value = '';

    const buscarNombre: HTMLInputElement = document.getElementById('buscarNombres') as HTMLInputElement;
    buscarNombre.value = '';

    this.personaService.cargarClientesPlanEstado( this.desde , this.planSeleccionado )
               .subscribe( (resp: any) => {

                this.totalClientes = resp[1][0].cantCli;

                this.clientes = resp[0];

                this.cargando = false;

              });

  }

// ==================================================
//        Carga los planes activos
// ==================================================

cargarPlanes() {

  this.cargando = true;

  this.planService.cargarTodasPlanes( )
             .subscribe( (resp: any) => {

              this.planes = resp[0];

              this.cantPlanes = resp[1][0].cantPlanes;

              this.cargando = false;

            });

}


// ==================================================
//  Busca un cliente por plan o por todos
// ==================================================

  buscarCliente( ) {

    const inputElement: HTMLInputElement = document.getElementById('buscarApellidos') as HTMLInputElement;
    const Apellidos: string = inputElement.value || null;

    const inputElement1: HTMLInputElement = document.getElementById('buscarNombres') as HTMLInputElement;
    const Nombres: string = inputElement1.value || null;

    this.personaService.buscarClientePorPlan( Apellidos, Nombres , this.planSeleccionado.toString()  )
            .subscribe( (resp: any) => {

              if( resp.length !== 0 ) {
                this.clientes = resp;
              } else {
                this.totalClientes = 0;
                this.clientes = resp[0];
              }
            });

  }

// ==================================================
//    Marca la asistencia de un determinado cliente dado un plan
// ==================================================

marcarAsistencia(IdPersona: number) {

  this.asistenciaService.marcarAsistenciaPersona( IdPersona )
              .subscribe( (resp: any) => {


               if ( resp.Mensaje === 'Ok') {
                 Swal.fire({
                   position: 'top-end',
                   icon: 'success',
                   title: 'Asistencia Marcada',
                   showConfirmButton: false,
                   timer: 2000
                 });
               } else {
                 Swal.fire({
                   icon: 'error',
                   title: 'Asistencias agotadas',
                   text: 'Sin asistencias para el plan',
                 });
               }
               this.cargarClientes();

             });

 }


// ==================================================
//        Borra una persona
// ==================================================

 eliminarCliente( cliente: Cliente ) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + cliente.Nombres + ' ' + cliente.Apellidos,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    })
    .then( borrar => {

      if (borrar) {

        const parametro = cliente.IdPersona.toString();

        this.personaService.eliminarCliente( parametro )
                  .subscribe( (resp: any) => {
                      this.cargarClientes();
                      if ( resp.mensaje === 'Ok') {
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: 'Cliente eliminado',
                          showConfirmButton: false,
                          timer: 2000
                        });
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Error al eliminar',
                          text: 'Contactese con el administrador',
                        });
                      }
                      this.cargarClientes();

                    });

                  }
                });
              }
// ==================================================
//        Cambio de valor
// ==================================================

cambiarDesde( valor: number ) {

  const desde = this.desde + valor;

  if ( desde >= this.totalClientes ) {
    return;
  }

  if ( desde < 0 ) {
    return;
  }

  this.desde += valor;
  this.cargarClientes();

}

}
