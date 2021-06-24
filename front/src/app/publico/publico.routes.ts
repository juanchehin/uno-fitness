import { RouterModule, Routes } from '@angular/router';
import { PublicoComponent } from './publico.component';


// import { ProfesionalComponent } from '../login/profesional.component';
import { AcercaComponent } from '../publico/acerca/acerca.component';
import { ContactoComponent } from '../publico/contacto/contacto.component';
import { GaleriaComponent } from '../publico/galeria/galeria.component';
import { PrincipalComponent } from '../publico/principal/principal.component';



// Vista por usuarios
import { PlanesPublicComponent } from '../publico/planes/planespublic.component';
import { ProfesionalesPublicComponent } from '../publico/profesionales/profesionalespublic.component';
import { LoginComponent } from '../shared/login/login.component';


const publicoRoutes: Routes = [
    {
        path: '',
        component: PublicoComponent,
        children: [
            { path: 'acerca', component: AcercaComponent },
            { path: 'principal', component: PrincipalComponent },
            { path: 'contacto', component: ContactoComponent },
            { path: 'galeria', component: GaleriaComponent },
            { path: 'planes', component: PlanesPublicComponent },
            { path: 'profesionales', component: ProfesionalesPublicComponent },
            { path: 'login', component: LoginComponent },
            { path: '**', redirectTo: '/principal', pathMatch: 'full' }
        ]
    }
    // { path: '**', component: PrincipalComponent }
];

export const PUBLICO_ROUTES = RouterModule.forChild( publicoRoutes );
