import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgateModuleComponent } from './resgate-module.component';

describe('ResgateModuleComponent', () => {
  let component: ResgateModuleComponent;
  let fixture: ComponentFixture<ResgateModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResgateModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResgateModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
