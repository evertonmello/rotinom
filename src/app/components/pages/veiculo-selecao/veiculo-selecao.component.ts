import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MonitorService } from 'src/app/shared/services/monitor.service';

@Component({
  selector: 'app-veiculo-selecao',
  templateUrl: './veiculo-selecao.component.html',
  styleUrls: ['./veiculo-selecao.component.scss']
})
export class VeiculoSelecaoComponent implements OnInit {

  public veiculoSelecionado;
  public veiculos;
  public user;
  constructor(
    private monitorService: MonitorService,
    private router: Router,
    private auth: AuthService) {
    this.user = this.auth.userLogged;
  }

  ngOnInit(): void {
    this.getVeiculosSuport();
  }

  getVeiculosSuport() {
    this.monitorService.getVeiculosSuport().subscribe((resp: any) => {
      this.veiculos = resp.dataResult
    })
  }

  setUSerVeiculo() {
    let veiculoSelc = this.veiculos.filter((item) => {
      return item.veiculoId == this.veiculoSelecionado
    })
    this.monitorService.vincularUserVeiculo(this.user.dataResult.data.id, veiculoSelc[0].veiculoId).subscribe(() => {
    });
    localStorage.setItem('veiculoSelecionado', JSON.stringify(veiculoSelc))
    this.router.navigate(['/home/servicos']);
  }

}
