import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorHomeComponent } from './tailor-home.component';

describe('TailorHomeComponent', () => {
  let component: TailorHomeComponent;
  let fixture: ComponentFixture<TailorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TailorHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
