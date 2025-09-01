import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonProductListComponent } from './common-product-list.component';

describe('CommonProductListComponent', () => {
  let component: CommonProductListComponent;
  let fixture: ComponentFixture<CommonProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonProductListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
