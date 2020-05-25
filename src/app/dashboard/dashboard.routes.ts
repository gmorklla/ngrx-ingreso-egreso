import { Routes } from '@angular/router';
import { DetalleComponent } from './../ingreso-egreso/detalle/detalle.component';
import { IngresoEgresoComponent } from './../ingreso-egreso/ingreso-egreso.component';
import { EstadisticaComponent } from './../ingreso-egreso/estadistica/estadistica.component';

export const dashboadRoutes: Routes = [
  { path: '', component: EstadisticaComponent },
  { path: 'ingreso-egreso', component: IngresoEgresoComponent },
  { path: 'detalle', component: DetalleComponent },
];
