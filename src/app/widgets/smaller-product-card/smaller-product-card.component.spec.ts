import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallerProductCardComponent } from './smaller-product-card.component';

describe('SmallerProductCardComponent', () => {
  let component: SmallerProductCardComponent;
  let fixture: ComponentFixture<SmallerProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallerProductCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmallerProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
