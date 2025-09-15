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
  showDeleteConfirm = false;
  modalTitle = '';
  modalItems: { name: string; route?: string; type?: string }[] = [];

  // List of use cases
  useCases: { name: string; route?: string; type?: string }[] = [
    { name: 'Sells', route: 'sells', type: 'usecase' },
    { name: 'Dev Tools', route: 'dev-tools', type: 'usecase' },
    { name: 'Productivity', route: 'productivity', type: 'usecase' },
    { name: 'Marketing', route: 'marketing', type: 'usecase' },
    { name: 'Design', route: 'design', type: 'usecase' }
  ];

  // List of technologies
  technologies: { name: string; route?: string; type?: string }[] = [
    { name: 'Java', route: 'java', type: 'technology' },
    { name: 'Python', route: 'python', type: 'technology' },
    { name: 'JavaScript', route: 'javascript', type: 'technology' },
    { name: 'TypeScript', route: 'typescript', type: 'technology' },
    { name: 'C#', route: 'csharp', type: 'technology' },
    { name: 'C++', route: 'cpp', type: 'technology' },
    { name: 'Go', route: 'go', type: 'technology' },
    { name: 'Rust', route: 'rust', type: 'technology' },
    { name: 'Kotlin', route: 'kotlin', type: 'technology' },
    { name: 'Swift', route: 'swift', type: 'technology' },
    { name: 'PHP', route: 'php', type: 'technology' },
    { name: 'Ruby', route: 'ruby', type: 'technology' }
  ];

  setActive(useCaseName: string) {
    this.activeUseCase = useCaseName;
    this.showDeleteConfirm = false;
  }

  openModal(title: string, items: { name: string; route?: string; type?: string }[]) {
    this.modalTitle = title;
    this.modalItems = items;
    this.showDeleteConfirm = true;
  }

  closeModal() {
    this.showDeleteConfirm = false;
  }
}
