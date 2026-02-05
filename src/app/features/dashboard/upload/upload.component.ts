import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VendaAgregada } from 'src/app/core/models/venda.model';
import { VendasService } from 'src/app/core/services/vendas.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @Output() dadosCarregados = new EventEmitter<VendaAgregada[]>();
  @Output() erroUpload = new EventEmitter<string>();

  constructor(private vendasService: VendasService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const textoCsv = e.target.result;

          localStorage.setItem('ultimo_csv', textoCsv);

          const dadosAgregados =
            this.vendasService.processarDadosString(textoCsv);

          this.dadosCarregados.emit(dadosAgregados);
        } catch (err: any) {
          this.erroUpload.emit(err.message);
        }
      };

      reader.onerror = () => this.erroUpload.emit('Erro ao ler o arquivo.');

      reader.readAsText(file);
    }
  }
}
