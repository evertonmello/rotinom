


import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResgateService } from '../services/regate.service';
import { ImageDialog } from './image-dialog';
import { MonitorDialog } from './monitor-dialog';

@Component({
    selector: 'galery-dialog',
    templateUrl: 'galery-dialog.html',
    styleUrls:['galery-dialog.scss']
})
export class GaleryDialog {

    public file;
    public images;
    public showLoader = false;
    constructor(
        public dialogRef: MatDialogRef<any>,
        private resgateService: ResgateService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.getServicosImagens();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getServicosImagens(){
        this.resgateService.getArquivosServico(this.data.id).subscribe((resp:any)=>{
            this.images = resp.dataResult;
        });
    }

    fileChange(event){
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        this.file = formData;
        this.enviar();
    }

    enviar(){
        this.showLoader = true;
        this.resgateService.enviarArquivos(this.data.id, this.file).subscribe((resp:any)=>{
            this.showLoader = false;
            this.getServicosImagens();
            this.showResponseMessage('Sucesso', 'Arquivos enviados com sucesso')
        },(erro)=>{ 
            this.showLoader = false;
            this.showResponseMessage('Erro', erro) 
        })
    }
    openImagemFull(url){
        this.dialog.open(ImageDialog, {
          width: '80%',
          data: { url: url}
        })
    }

    remoteImage(image){
        this.showLoader = true;
        this.resgateService.removeArquivo(image.id).subscribe((resp:any)=>{
            this.showLoader = false;
            this.getServicosImagens();
            this.showResponseMessage('Sucesso', 'Arquivo removido com sucesso')
        },(erro)=>{ 
            this.showLoader = false;
            this.showResponseMessage('Erro', erro) 
        })
    }

    showResponseMessage(titulo: string, mensagem: string) {
        this.dialog.open(MonitorDialog, {
            width: '500px',
            data: {
                data: -1,
                message: {
                    title: titulo,
                    body: mensagem
                }
            }
        });
      }

}

