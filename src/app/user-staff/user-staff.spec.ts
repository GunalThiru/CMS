import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStaff } from './user-staff';

describe('UserStaff', () => {
  let component: UserStaff;
  let fixture: ComponentFixture<UserStaff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStaff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStaff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
