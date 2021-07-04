import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MonitorService } from '../services/monitor.service';
import { MonitorDialog } from './monitor-dialog';


@Component({
    selector: 'historico-dialog',
    templateUrl: 'historico-dialog.html',
    styles: [`
    button{
        position: absolute;
        right: 8px;
        top: 16px;
    }
`],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
    }]
})
export class HistoricoDialog implements OnInit {

    @ViewChild('stepper') stepper;

    constructor(
        public dialogRef: MatDialogRef<any>,
        public dialog: MatDialog,
        private monitorService: MonitorService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    cancelarOrdem(ordem){
        this.monitorService.cancelaOrdem(ordem.id).subscribe(()=>{
            this.showMessage('Sucesso', 'Ordem Cancelada com sucesso')
        })
    }

    showMessage(title, body) {
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

