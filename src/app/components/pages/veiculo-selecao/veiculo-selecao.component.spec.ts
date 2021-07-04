import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculoSelecaoComponent } from './veiculo-selecao.component';

describe('VeiculoSelecaoComponent', () => {
  let component: VeiculoSelecaoComponent;
  let fixture: ComponentFixture<VeiculoSelecaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeiculoSelecaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VeiculoSelecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
