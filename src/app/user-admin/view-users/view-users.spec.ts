import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsersComponent } from './view-users';

describe('ViewUsers', () => {
  let component: ViewUsersComponent;
  let fixture: ComponentFixture<ViewUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
