import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgateFormComponent } from './resgate-form.component';

describe('ResgateFormComponent', () => {
  let component: ResgateFormComponent;
  let fixture: ComponentFixture<ResgateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResgateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResgateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
