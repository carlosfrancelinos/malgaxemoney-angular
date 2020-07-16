import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NaoAutorizadoComponent } from './core/nao-autorizado.module';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';

const routes: Routes = [
  {
    path: 'lancamentos',
    loadChildren: () => import('./lancamentos/lancamentos.module').then(l => l.LancamentosModule)
  },
  {
    path: 'pessoas',
    loadChildren: () => import('./pessoas/pessoas.module').then(p => p.PessoasModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(p => p.DashboardModule)
  },
  {
    path: 'relatorios',
    loadChildren: () => import('./relatorios/relatorios.module').then(p => p.RelatoriosModule)
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent},
  { path: 'nao-autorizado', component: NaoAutorizadoComponent},
  { path: '**', redirectTo: 'pagina-nao-encontrada'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
