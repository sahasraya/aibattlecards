import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEnterResultComponent } from './search-enter-result.component';

describe('SearchEnterResultComponent', () => {
  let component: SearchEnterResultComponent;
  let fixture: ComponentFixture<SearchEnterResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEnterResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchEnterResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
