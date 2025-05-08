import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorDashboardComponent } from './tailor-dashboard.component';

describe('TailorDashboardComponent', () => {
  let component: TailorDashboardComponent;
  let fixture: ComponentFixture<TailorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TailorDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
