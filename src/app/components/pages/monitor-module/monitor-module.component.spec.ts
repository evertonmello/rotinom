import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorModuleComponent } from './monitor-module.component';

describe('MonitorModuleComponent', () => {
  let component: MonitorModuleComponent;
  let fixture: ComponentFixture<MonitorModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
