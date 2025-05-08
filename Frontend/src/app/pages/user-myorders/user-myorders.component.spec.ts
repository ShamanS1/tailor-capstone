import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyordersComponent } from './user-myorders.component';

describe('UserMyordersComponent', () => {
  let component: UserMyordersComponent;
  let fixture: ComponentFixture<UserMyordersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMyordersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMyordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
