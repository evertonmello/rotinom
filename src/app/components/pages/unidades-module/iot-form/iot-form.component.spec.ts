import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotFormComponent } from './iot-form.component';

describe('IotFormComponent', () => {
  let component: IotFormComponent;
  let fixture: ComponentFixture<IotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IotFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
