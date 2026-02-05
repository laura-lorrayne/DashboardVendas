import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VendaAgregada } from 'src/app/core/models/venda.model';

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.scss'],
})
export class DetalheComponent {
  venda?: VendaAgregada;

  constructor(public bsModalRef: BsModalRef) {}
}
