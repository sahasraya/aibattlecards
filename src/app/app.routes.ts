import { Routes } from '@angular/router';
import { MainHomeComponent } from './home/main-home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProductItemComponent } from './home/product-item/product-item.component';
import { ProfileComponent } from './home/profile/profile.component';
import { BattleCardComponent } from './home/battle-card/battle-card.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { EmailAuthComponent } from './auth/email-auth/email-auth.component';
import { CategoryComponent } from './home/category/category.component';
import { ResetComponent } from './auth/reset/reset.component';

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
      },
      {
        path: 'category/:categoryName/:type',
        component: CategoryComponent
      }
          
       
       
    ]
  },
  {
    path: 'auth',
    children: [
       
      {
        path: 'log-in',
        component: LogInComponent
      },
       {
        path: 'sign-up',
        component: SignUpComponent
      },
       {
        path: 'authentication',
        component: EmailAuthComponent
      },
       
       {
        path: 'reset/:c',
        component: ResetComponent
      },
       
       
       
        
       
       
    ]
  },
  {
    path: '**', // fallback for unknown routes
    redirectTo: 'home'
  }
];
