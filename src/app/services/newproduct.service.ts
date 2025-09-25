import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NewProductStateService {
  private state: any[] | null = null;

  // Save new products
  saveState(data: any[]): void {
    this.state = data;
  }

  // Get new products
  getState(): any[] | null {
    return this.state;
  }

  // Clear new products
  clearState(): void {
    this.state = null;
  }
}
