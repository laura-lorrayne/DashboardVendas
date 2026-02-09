import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CurrencyBrPipe } from '../../shared/pipes/currency-br.pipe';

import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { UploadComponent } from './upload/upload.component';
import { DetalheComponent } from './detalhe/detalhe.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    UploadComponent,
    DetalheComponent,
    PageHeaderComponent,
    CurrencyBrPipe,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    TableModule,
    ChartModule,
    InputTextModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
  ],
  exports: [DashboardComponent],
  entryComponents: [DetalheComponent],
})
export class DashboardModule {}
