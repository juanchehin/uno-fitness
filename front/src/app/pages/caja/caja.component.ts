import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import { Persona } from 'src/app/models/persona.model';
import { ActivatedRoute} from '@angular/router';
import { PersonaService } from 'src/app/services/service.index';
import { CajaService } from '../../services/caja/caja.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: []
})
export class CajaComponent implements OnInit {
  forma: FormGroup;
  cargando = true;
  persona: Persona[] = [];
  movimientosCliente: any[] = [];
  private date: string;
  valor = 0;
  totalMovimientosCliente = 0;
  desde = 0;



  constructor(private activatedRoute: ActivatedRoute, public personaService: PersonaService, public cajaService: CajaService) { }


  ngOnInit() {
    this.cargarMovimientosCliente();
    this.cargarPersona();

  }


  nuevaCaja() {

    if ( this.forma.invalid ) {
      return;
    }


    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Usuario "' + this.forma.value.Usuario + '" cargado',
      showConfirmButton: false,
      timer: 2000
    });

    }

// ==================================================
//        Carga de persona
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

// ==================================================
//   Carga los movimientos de un cierto cliente, dado su id
// ==================================================

cargarMovimientosCliente() {

  this.cargando = true;

  this.date = this.activatedRoute.snapshot.paramMap.get('id');

  this.cajaService.dameMovimientosClientes( this.date , this.desde )
             .subscribe( (resp: any) => {

              this.movimientosCliente = resp[0];

              this.totalMovimientosCliente = resp[1][0].maximo;

              this.cargando = false;

            });

}
// ==================================================
//        Cambio de valor
// ==================================================

cambiarDesde( valor: number ) {

  const desde = this.desde + valor;

  if ( desde >= this.totalMovimientosCliente ) {
    return;
  }

  if ( desde < 0 ) {
    return;
  }

  this.desde += valor;
  this.cargarMovimientosCliente();

}
}

