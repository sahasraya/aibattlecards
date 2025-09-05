import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
 activeUseCase: string = '';

  // List of use cases
  useCases: { name: string; route?: string }[] = [
    { name: 'Sells', route: 'Sells' },
    { name: 'Dev Tools', route: 'Dev Tools' },
    { name: 'Productivity',route: 'Productivity' },  
    { name: 'Marketing', route: 'Marketing' },
    { name: 'Design', route: 'Design' }
  ];

  setActive(useCaseName: string) {
    this.activeUseCase = useCaseName;
  }
}
