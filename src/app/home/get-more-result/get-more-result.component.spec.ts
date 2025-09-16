import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMoreResultComponent } from './get-more-result.component';

describe('GetMoreResultComponent', () => {
  let component: GetMoreResultComponent;
  let fixture: ComponentFixture<GetMoreResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetMoreResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetMoreResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
