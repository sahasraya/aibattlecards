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
  useCases: { name: string; route?: string; type?: string}[] = [
    { name: 'Sells', route: 'Sells' ,type:'usecase'},
    { name: 'Dev Tools', route: 'Dev Tools' ,type:'usecase'},
    { name: 'Productivity',route: 'Productivity' ,type:'usecase'},  
    { name: 'Marketing', route: 'Marketing',type:'usecase' },
    { name: 'Design', route: 'Design' ,type:'usecase'}
  ];

  setActive(useCaseName: string) {
    this.activeUseCase = useCaseName;
  }
}
