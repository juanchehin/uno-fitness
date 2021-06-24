import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ChartsModule } from 'ng2-charts';

import { PUBLICO_ROUTES } from './publico.routes';
import { PublicoComponent } from './publico.component';

import { AcercaComponent } from '../publico/acerca/acerca.component';
import { ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Vista por usuarios
import { PlanesPublicComponent } from '../publico/planes/planespublic.component';
import { ProfesionalesPublicComponent } from '../publico/profesionales/profesionalespublic.component';
import { ContactoComponent } from '../publico/contacto/contacto.component';
import { GaleriaComponent } from '../publico/galeria/galeria.component';
import { PrincipalComponent } from '../publico/principal/principal.component';





@NgModule({
    declarations: [
        PublicoComponent,
        PrincipalComponent,
        PlanesPublicComponent,
        ProfesionalesPublicComponent,
        ContactoComponent,
        GaleriaComponent,
        AcercaComponent
    ],
    exports: [
        PrincipalComponent,
        PublicoComponent
    ],
    imports: [
        SharedModule,
        SelectModule,
        PUBLICO_ROUTES,
        ChartsModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule
    ]
})

export class PublicoModule { }
