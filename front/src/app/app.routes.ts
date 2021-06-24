import { RouterModule, Routes } from '@angular/router';


import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { LoginComponent } from './shared/login/login.component';



const appRoutes: Routes = [
    // {
    //     path: '',
    //     component: PagesComponent,
    //     children: [
    //         { path: 'principal', component: principalComponent },
    //         { path: 'progress', component: ProgressComponent },
    //         { path: 'graficas1', component: Graficas1Component },
    //         { path: 'register', component: RegisterComponent },
    //         { path: '', redirectTo: '/principal', pathMatch: 'full' }
    //     ]
    // },
    { path: 'login', component: LoginComponent },
    // Visible al usuario

    // { path: 'cliente', component: ClienteComponent },
    { path: '**', component: NopagefoundComponent }
];


export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );
