import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorLayoutComponent } from './tailor-layout.component';

describe('TailorLayoutComponent', () => {
  let component: TailorLayoutComponent;
  let fixture: ComponentFixture<TailorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TailorLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
