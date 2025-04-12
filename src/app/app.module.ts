import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';  // FormsModule ekledik
import { CommonModule } from '@angular/common';  // CommonModule import ettik
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


import { AppComponent } from './app.component';
import { PersonelKadroComponent } from './pages/personel-kadro/personel-kadro.component';  // Personel Kadro Component importu

// Layout
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// PrimeNG
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChartModule } from 'primeng/chart';  // Chart modülünü import ettik

// Routing
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    PersonelKadroComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PanelMenuModule,
    ChartModule,
    RouterModule.forRoot(routes),
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
