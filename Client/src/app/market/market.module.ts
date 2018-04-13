import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { MarketRoutingModule } from './market-routing.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatSelectModule, MatGridListModule,
MatFormFieldModule, MatButtonModule } from '@angular/material';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MarketService } from './market.service';
import { RouterModule, Routes } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule,
MatSlideToggleModule, MatIconModule, MatRadioModule} from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MarketRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatGridListModule,
    MatPaginatorModule,
    MatRadioModule,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    RouterModule
  ],
  providers: [MarketService, { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }],
    entryComponents: [MarketComponent, ProductDetailComponent],
  declarations: [MarketComponent, ProductDetailComponent, CreateProductComponent]
})
export class MarketModule { }
