import { Routes } from '@angular/router';
import { MainHomeComponent } from './home/main-home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProductItemComponent } from './home/product-item/product-item.component';
import { ProfileComponent } from './home/profile/profile.component';
import { BattleCardComponent } from './home/battle-card/battle-card.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: MainHomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
       {
        path: 'product-item',
        component: ProductItemComponent
      },
       {
        path: 'user-profile',
        component: ProfileComponent
      },
        {
        path: 'battle-card',
        component: BattleCardComponent
      }
       
       
    ]
  },
  {
    path: '**', // fallback for unknown routes
    redirectTo: 'home'
  }
];
