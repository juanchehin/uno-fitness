import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';


// Planes
import { PlanComponent } from './planes/plan.component';
import { PlanesComponent } from './planes/planes.component';
import { EditarPlanComponent } from './planes/editarPlan.component';

// Caja
import { CajasComponent } from './caja/cajas.component';
import { IngresoComponent } from './caja/ingreso.component';
import { EgresoComponent } from './caja/egreso.component';
import { IngresosComponent } from './caja/ingresos.component';
import { EgresosComponent } from './caja/egresos.component';
import { CajaComponent } from './caja/caja.component';

// Mediciones
import { MedicionComponent } from './mediciones/medicion.component';
import { MedicionesComponent } from './mediciones/mediciones.component';
import { EditarmedicionComponent } from './mediciones/editarmedicion.component';


// Clientes
import { ClienteComponent } from './personas/clientes/cliente.component';
import { ClientesComponent } from './personas/clientes/clientes.component';
import { EditarclienteComponent } from './personas/clientes/editarcliente.component';
import { AsistenciasComponent } from './asistencias/asistencias.component';

// Profesionales
import { ProfesionalesComponent } from './personas/profesionales/profesionales.component';
import { ProfesionalComponent } from './personas/profesionales/profesional.component';
import { EditarprofesionalComponent } from './personas/profesionales/editarprofesional.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { GraficasComponent } from './graficas/graficas.component';

// GUARDS
import { AdminGuard } from '../services/guards/admin.guard';
import { VerificaTokenGuard } from '../services/guards/verifica-token.guard';
import { LoginGuardGuard } from '../services/guards/login-guard.guard';
import { ProfesionalAdminGuard } from '../services/guards/profesionalAdmin.guard';
import { HistoricoComponent } from './asistencias/historico.component';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuardGuard, AdminGuard, VerificaTokenGuard],
        children: [
            // Graficas
            { path: 'graficas/:id', component: GraficasComponent },
            { path: 'mantenimiento/perfil/:id', component: EditarprofesionalComponent },
            // Profesionales
            { path: 'mantenimiento/profesionales', component: ProfesionalesComponent },
            { path: 'mantenimiento/profesional', component: ProfesionalComponent },
            { path: 'profesional/perfil/:id', component: EditarprofesionalComponent },
            // Planes
            { path: 'mantenimiento/planes', component: PlanesComponent },
            { path: 'mantenimiento/plan/editar/:id', component: EditarPlanComponent },
            { path: 'mantenimiento/plan', component: PlanComponent },
            { path: '', redirectTo: 'principal', pathMatch: 'full' }
        ]
    },
    // Patch donde pueden acceder los clientes,profesionales y administradores
    {
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuardGuard, VerificaTokenGuard],
        children: [
            { path: 'dashboard/:id', component: DashboardComponent },
            { path: 'cliente/graficas/:id', component: GraficasComponent },
            { path: 'cliente/asistencias/:id', component: AsistenciasComponent },
            { path: 'cliente/mediciones/:id', component: MedicionesComponent },
            { path: 'cliente/medicion/editar/:IdMedicion/:IdPersona', component: EditarmedicionComponent },
            { path: 'cliente/asistencias/historico/:IdPersona', component: HistoricoComponent },
            { path: '', redirectTo: 'principal', pathMatch: 'full' }
        ]
    },
    // Patch donde pueden acceder los profesionales y administradores
    {
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuardGuard, ProfesionalAdminGuard, VerificaTokenGuard],
        children: [
            { path: 'dashboard/:id', component: DashboardComponent },
            { path: 'cliente/graficas/:id', component: GraficasComponent },
            { path: 'cliente/asistencias/:id', component: AsistenciasComponent },
            { path: 'cliente/mediciones/:id', component: MedicionesComponent },
            { path: 'cliente/medicion/:id', component: MedicionComponent },
            // Clientes
            { path: 'mantenimiento/clientes', component: ClientesComponent },
            { path: 'mantenimiento/cliente', component: ClienteComponent },
            { path: 'mantenimiento/cliente/editar/:id', component: EditarclienteComponent },
            // Caja
            { path: 'cajas', component: CajasComponent },    // Ruta principal de cajas
            { path: 'caja/:id', component: CajaComponent },
            { path: 'caja/ingreso/:id', component: IngresoComponent },
            { path: 'cajas/ingresos', component: IngresosComponent },
            { path: 'cajas/egresos', component: EgresosComponent },
            { path: 'cajas/egreso', component: EgresoComponent },
            { path: '', redirectTo: 'principal', pathMatch: 'full' }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
