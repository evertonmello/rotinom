import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesModuleComponent } from './unidades-module.component';

describe('UnidadesModuleComponent', () => {
  let component: UnidadesModuleComponent;
  let fixture: ComponentFixture<UnidadesModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadesModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
