import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetMoreScreenNewProductStateService {
  private state: any[] | null = null;

  saveState(data: any[]): void {
    this.state = data;
    console.log("✅ New Products saved:", this.state);
  }

  getState(): any[] | null {
    console.log("📦 Loading New Products:", this.state);
    return this.state;
  }

  clearState(): void {
    this.state = null;
    console.log("🗑️ Cleared New Products state");
  }
}
