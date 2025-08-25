import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleCardComponent } from './battle-card.component';

describe('BattleCardComponent', () => {
  let component: BattleCardComponent;
  let fixture: ComponentFixture<BattleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BattleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
