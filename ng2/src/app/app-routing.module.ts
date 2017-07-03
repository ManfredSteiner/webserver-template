import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { ProfilComponent } from './profil.component';

const routes: Routes = [
  { path: '', redirectTo: '/ng2/profil', pathMatch: 'full' }
  , { path: 'ng2/profil',  component: ProfilComponent }
  , { path: '**', redirectTo: '/ng2/profil', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
