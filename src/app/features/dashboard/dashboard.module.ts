import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { DetalheComponent } from './detalhe/detalhe.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [DashboardComponent, UploadComponent, DetalheComponent],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
