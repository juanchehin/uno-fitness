import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import { MedicionService } from 'src/app/services/medicion/medicion.service';
import { ActivatedRoute } from '@angular/router';
import { PersonaService } from 'src/app/services/service.index';
import { Medicion } from 'src/app/models/medicion.model';

import { ChartOptions, ChartDataSets } from 'chart.js';
import { Persona } from 'src/app/models/persona.model';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styles: []
})
export class GraficasComponent implements OnInit {





  constructor(
    public medicionService: MedicionService,
    private activatedRoute: ActivatedRoute,
    public personaService: PersonaService
  ) {
    this.cargarMediciones();
    this.cargarCliente();
    // this.cargarGraficas('Altura');
   }

   persona: Persona[] = [];
   desde = 0;  // Valor que indica a la BD desde donde mostrar los siguientes 5 elementos
   date: string;  // IdPersona obtenido del URL
   termino: number;  // Valor del IdPersona convertido a NUMBER
   totalRegistros = 0;
   cargando = true;
   IdPersona = '0';




  // ****** Defino parametros para las graficas ******
   parametroSeleccionado = 'Altura';  // Parametro seleccionado en el select
   Mediciones = ['Altura', 'Peso', 'IMC', 'Musc', 'Grasa', 'GV'];  // Array de mediciones para el SELECT

   // Defino los arrays que se van a ir cargando dinamicamente
   Fechas: Label[] = [];
   Alturas = [];
   Pesos = [];
   IMCs = [];
   Muscs = [];
   Grasas = [];
   GVs = [];

  mediciones: Medicion;  // Aqui se carga la respuesta del SERVER

  // Opciones que definen desde donde empieza la grafica , ancho , alto , etc.
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{ticks: {
      beginAtZero: true
    }}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  // Defino el color para las barras
  public barChartColors: Color[] = [
    { backgroundColor: '#BDB76B' }
  ];

  // Valores cargados abajo de la barra, se carga aqui las fechas
  public barChartLabels = this.Fechas;

  // Indica el tipo de grafica , puede ser : line, bar, radar, pie, polarArea, doughnut
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  // Aqui se cargan los valores del grafico , son las distintas alturas de las barras
  public barChartData: ChartDataSets[] = [
    { data: [], label: this.parametroSeleccionado.toString(), backgroundColor: 'coral' }
  ];
  // ****** Fin definicion parametros para las graficas ******



  ngOnInit() {
  }


// ==================================================
// Funcion que carga las graficas con sus valores
// Se dispara al hacer click sobre una MEDICION en el HTML
// Recibe el valor que el usuario desea graficar como parametro (el que se selecciono en el SELECT)
// ==================================================
  cargarGraficas(deviceValue) {
    this.barChartLabels = this.Fechas;
    this.parametroSeleccionado = deviceValue;

    switch (deviceValue) {
      case 'Altura':
        this.barChartData[0].data = this.Alturas;
        this.barChartData[0].label = this.parametroSeleccionado;
        this.barChartColors[0].backgroundColor = 'coral';
        // this.barChartData[0].backgroundColor = 'coral';  // <-- CONSULTAR por que tiene un DELAY

        break;
      case 'Peso':
        this.barChartData[0].data = this.Pesos;
        this.barChartData[0].label = this.parametroSeleccionado;
        this.barChartColors[0].backgroundColor = 'rgb(201, 76, 76)';
        // this.barChartData[0].backgroundColor = 'rgb(201, 76, 76)';

        break;
      case 'IMC':
        this.barChartData[0].data = this.IMCs;
        this.barChartData[0].label = this.parametroSeleccionado;
        this.barChartColors[0].backgroundColor = 'rgb(50, 115, 220)';
        // this.barChartData[0].backgroundColor = 'rgba(201, 76, 76, 0.3)';

        break;
      case 'Musc':
        this.barChartData[0].data = this.Muscs;
        this.barChartData[0].label = this.parametroSeleccionado;
        this.barChartColors[0].backgroundColor = 'hsl(89, 43%, 51%)';
        break;
      case 'Grasa':
        this.barChartData[0].data = this.Grasas;
        this.barChartData[0].label = this.parametroSeleccionado;
        this.barChartColors[0].backgroundColor = '#f18973';
        break;
      case 'GV':
        this.barChartData[0].data = this.GVs;
        this.barChartData[0].label = this.parametroSeleccionado;
        this.barChartColors[0].backgroundColor = '#80ced6';
        break;
    }
  }

// ==================================================
//    Carga de a 5 mediciones (o menos) dado un id de persona
// ==================================================

cargarMediciones() {

  this.cargando = true;

  this.date = this.activatedRoute.snapshot.paramMap.get('id');
  this.termino = Number(this.date);

  this.Fechas = [];
  this.Alturas = [];
  this.Pesos = [];
  this.IMCs = [];
  this.Grasas = [];
  this.GVs = [];

  this.medicionService.dameMediciones( this.termino , this.desde )
             .subscribe( (resp: any) => {

              // Setear el total de las mediciones en totalRegistros
              this.mediciones = resp[0];
              this.totalRegistros = resp[1][0].totalMediciones;

               // Lleno los arrays para que se muestren en las graficas . El for elimina las fechas repetidas
              for ( let i = 0 ; i < resp[0].length ; i++ ) {
                this.Fechas[i] = this.mediciones[i].Fecha;
                this.Alturas[i] = this.mediciones[i].Altura;
                this.Pesos[i] = this.mediciones[i].Peso;
                this.IMCs[i] = this.mediciones[i].IMC;
                this.Muscs[i] = this.mediciones[i].Musc;
                this.Grasas[i] = this.mediciones[i].Grasa;
                this.GVs[i] = this.mediciones[i].GV;
              }

              this.cargando = false;

              this.cargarGraficas(this.parametroSeleccionado);

            });






}

// ==================================================
//     Carga el cliente actual, para mostrar en el titulo
// ==================================================

cargarCliente() {

  this.cargando = true;

  this.personaService.damePersona( this.date )
             .subscribe( (resp: any) => {


              this.persona = resp;

              this.cargando = false;

            });

}

// ==================================================
//
// ==================================================
comprobarRol() {
  this.IdPersona = this.personaService.personaId;
  if (this.personaService.IdRol === 2 || this.personaService.IdRol === 3) {
    return true;
  } else {
    return false;
  }
}

// ==================================================
// Cambia las graficas a las proximas 5 mediciones tomadas (por fecha)
// ==================================================

cambiarDesde( valor: number ) {


  const desde = this.desde + valor;

  if ( desde >= this.totalRegistros ) {
    return;
  }

  if ( desde < 0 ) {
    return;
  }

  this.desde += valor;
  this.cargarMediciones();
  this.cargarGraficas(this.parametroSeleccionado);
}

}
