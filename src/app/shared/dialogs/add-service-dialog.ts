import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResgateService } from '../services/regate.service';
import { MonitorDialog } from './monitor-dialog';


@Component({
    selector: 'add-service-dialog',
    templateUrl: 'add-service-dialog.html',    
    styles: [`
    mat-form-field,button{
        width: 100%;
    }
    .servive-item-cnt{
        display: flex;
        align-items: center;
        margin: 8px 0;
        justify-content: space-between;
        border-bottom: 0.01cm solid #bfbfbf8f;
    }

    .child-service{
        align-items: center;
        display: flex;
    }

    .loader-ctn{
        left: 0;
    }


`],
})
export class AddServiceDialog {

    public showLoader = false;
    public services = []
    public servico = 1;
    public veiculoResgateTipoId;
    public veiculoResgateTipoId2;
    public resgateForm: FormGroup;
    public suporteItens;

    public motivosSuportCampo =
    [
      { value: 2, label: 'Acidente' },
      { value: 4, label: 'Chave perdida' },
      { value: 5, label: 'Problema elétrico' },
      { value: 6, label: 'Problema mecânico' },
      { value: 10, label: 'Roda dianteira' },
      { value: 9, label: 'Roda traseira' },
      { value: 11, label: 'Tentativa de roubo' }
    ];

    public motivosSuporteRecolhimentio =
    [
        { value: 15, label: 'Acidente' },
        { value: 18, label: 'Apoio' },
        { value: 17, label: 'Delegacia de Polícia' },
        { value: 7, label: 'Inadimplência' },
        { value: 8, label: 'Manutenção' },
        { value: 3, label: 'Mau uso' },
        { value: 12, label: 'Multa de trânsito' },
        { value: 16, label: 'Pátio' },
        { value: 13, label: 'Solicitação' }
    ];

    comentario
    constructor(
        public dialogRef: MatDialogRef<any>,
        private fb: FormBuilder,
        private resgateService: ResgateService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
        this.resgateForm = this.fb.group({
            veiculoResgateTipoId: ['', Validators.required],
            servico: [1, Validators.required],
            observacao: ['']
        });
        this.getServiceItens();
    }

    getServiceItens(){
        this.resgateService.getServiceItens(this.data.id).subscribe((resp:any)=>{
            this.suporteItens = resp.dataResult;
        })
    }

    addService(){
        this.showLoader = true;
        this.resgateService.addServiceItem({
            veiculoResgateId: this.data.id,
            veiculoResgateTipoId: this.data.veiculoResgateTipoId,
            quantidade: 1
        }).subscribe((resp:any)=>{
            this.showLoader = false;
        },()=>{
            this.showLoader = false;
        })
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    add(){

    }
    remove(){

    }
    delete(id){
        this.resgateService.removeServiceItem(id).subscribe(()=>{
            this.getServiceItens();
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

