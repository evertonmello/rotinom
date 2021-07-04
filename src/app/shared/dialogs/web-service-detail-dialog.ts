import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResgateService } from '../services/regate.service';
import { GaleryDialog } from './galery-dialog';
import { ImageDialog } from './image-dialog';
import { MonitorDialog } from './monitor-dialog';


@Component({
    selector: 'web-service-detail-dialog',
    templateUrl: 'web-service-detail-dialog.html',    
    styleUrls:['web-service-detail-dialog.scss']
})
export class WebServiceDetaillDialog {

    @Input()servicoSelecionado;
    public showLoader = false;
    public veiculosSuporte;
    public estimativas = [];
    public veiculoSuporteIdSelectd;
    constructor(
        public dialogRef: MatDialogRef<any>,
        private fb: FormBuilder,
        private resgateService: ResgateService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.servicoSelecionado = data.veiculo;
        this.veiculosSuporte = data.veiculosSuporte;
    }

    ngOnInit() {
        this.getEstimativas();
    }

    cancelarServico(){
        this.showLoader = true;
        this.resgateService.cancelarServico(this.servicoSelecionado.id, "").subscribe(()=>{
            this.showLoader = false;
            this.showMessageDialog('Sucesso', 'Serviço Cancelado com sucesso');
            this.dialogRef.close(true);
        },()=>{
            this.showLoader = false;
        })
    }
    abriWhatsapp(servicoSelecionado) {
        var tel =  servicoSelecionado.locatarioTelefone.ddd +
        servicoSelecionado.locatarioTelefone.numero;
        tel = tel.replace('(', '');
        tel = tel.replace(')', '');
        tel = tel.replace(' ', '');
        window.open('https://api.whatsapp.com/send?phone=55$' + tel)
      }
    

    onNoClick(): void {
        this.dialogRef.close();
    }

    getEstimativas(){
        this.resgateService.estimaSuporte(this.servicoSelecionado.id).subscribe((resp:any)=>{
            let estimativas = resp.dataResult;
            this.sortEstimativas(estimativas);
        })
    }
    getGoogleUrl(servico) {
        window.open('https://www.google.com/maps/search/?api=1&query=' + servico.latitude + ',' + servico.longitude )
    }

    openGalery(){
        this.dialog.open(GaleryDialog,{
            width: '80%',
            height: '80%',
            data: {id: this.servicoSelecionado.id}
        })
    }

    getDateDiff(startDate, endDate){
        if(!startDate ){
            startDate = new Date();
        }
        let milsec = new Date(endDate).getTime() - new Date(startDate).getTime();
        let min = (milsec / 1000) / 60;
        return (min * -1).toFixed(0);
    }

    openCnh(){
        this.resgateService.getLocatarioInfo(this.servicoSelecionado.locatarioId).subscribe((resp:any)=>{
          this.dialog.open(ImageDialog,{
            width: '40%',
            data: {cnh: resp.dataResult.urlCNH}
          })
        })
      }
    
      openSelfie(){
        this.resgateService.getLocatarioInfo(this.servicoSelecionado.locatarioId).subscribe((resp:any)=>{
          this.dialog.open(ImageDialog,{
            width: '40%',
            data: {selfie:resp.dataResult.urlSelfie}
          })
        })
      }


    sortEstimativas(estimativas){
        this.veiculosSuporte.forEach(item => {
            estimativas.forEach(element => {
              if(element.veiculoSuportePlaca === item.veiculoSuportePlaca){
                  this.estimativas.push(element.tempo)
              }  
            });
        });
    }

    escalar(){
        this.resgateService.escalar(this.servicoSelecionado.id,this.veiculoSuporteIdSelectd, 0).subscribe((resp:any)=>{
            this.showMessageDialog('Sucesso', 'Serviço escalado com sucesso')
            this.dialogRef.close(true);
        });
    }

  

    showMessageDialog(title, body) {
        this.dialog.open(MonitorDialog, {
            width: '500px',
            data: {
                data: -1,
                message: {
                    title: title,
                    body: body
                }
            }
        });
    }

}

