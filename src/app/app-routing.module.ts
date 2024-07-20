import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {provideHttpClient} from "@angular/common/http";

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then((c) =>  c.DashboardComponent)
  },
  { path:'**', pathMatch: 'full', redirectTo:'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [provideHttpClient()]
})
export class AppRoutingModule { }
