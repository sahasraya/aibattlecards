import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetMoreScreenMostViewedProductStateService {
  private state: any[] | null = null;

  saveState(data: any[]): void {
    this.state = data;
    console.log("✅ Most Viewed Products saved:", this.state);
  }

  getState(): any[] | null {
    console.log("📦 Loading Most Viewed Products:", this.state);
    return this.state;
  }

  clearState(): void {
    this.state = null;
    console.log("🗑️ Cleared Most Viewed Products state");
  }
}
