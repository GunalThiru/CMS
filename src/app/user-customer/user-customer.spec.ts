import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCustomerComponent } from './user-customer';

describe('UserCustomer', () => {
  let component: UserCustomerComponent;
  let fixture: ComponentFixture<UserCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
