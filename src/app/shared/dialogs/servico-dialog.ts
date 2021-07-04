import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResgateService } from 'src/app/shared/services/regate.service';
import { MonitorDialog } from './monitor-dialog';


@Component({
    selector: 'servico-dialog',
    templateUrl: 'servico-dialog.html',
    styles: [`
    .mat-dialog-actions,button{
        width: 100%;
    }
`],
})
export class ServicoDialog {

    public motivo;
    constructor(
        public dialogRef: MatDialogRef<any>,
        private resgateService: ResgateService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log(this.data)
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    enviar() {
        this.resgateService.rejeitar(this.data.id, this.motivo).subscribe((resp: any) => {
            this.dialogRef.close();
            this.dialog.open(MonitorDialog, {
                width: '500px',
                data: {
                    data: -1,
                    message: {
                        title: "Sucesso",
                        body: "Serviço Rejeitado"
                    }
                }
            });
        })
    }

}

