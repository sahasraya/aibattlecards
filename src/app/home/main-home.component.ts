import { Component } from '@angular/core';
import { HeaderComponent } from '../widgets/header/header.component';
import { SideMenuComponent } from '../widgets/side-menu/side-menu.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../widgets/loading/loading.component';

@Component({
  selector: 'app-main-home',
  standalone: true,
  imports: [HeaderComponent,SideMenuComponent,RouterModule,LoadingComponent],
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.css'
})
export class MainHomeComponent {

}
