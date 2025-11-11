import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintsListComponent } from './customer-complaints-list';

describe('CustomerComplaintsList', () => {
  let component: CustomerComplaintsListComponent;
  let fixture: ComponentFixture<CustomerComplaintsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerComplaintsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerComplaintsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
