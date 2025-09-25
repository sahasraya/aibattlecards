import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetMoreScreenFeaturedProductStateService {
  private state: any[] | null = null;

  saveState(data: any[]): void {
    this.state = data;
    console.log("✅ Featured Products saved:", this.state);
  }

  getState(): any[] | null {
    console.log("📦 Loading Featured Products:", this.state);
    return this.state;
  }

  clearState(): void {
    this.state = null;
    console.log("🗑️ Cleared Featured Products state");
  }
}
