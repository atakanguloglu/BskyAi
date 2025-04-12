import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelMenuModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidebarOpen = true;

  menuItems: MenuItem[] = [
    // Main Section
    { label: 'Ana Sayfa', icon: 'pi pi-home', routerLink: ['/dashboard'] },

    // Recommendations
    {
      label: 'Öneriler', icon: 'pi pi-th-large',
      items: [
        { label: 'Yapay Zeka Kadro', icon: 'pi pi-star', routerLink: ['/kadro-onerisi'] },
        { label: 'Diziliş', icon: 'pi pi-sitemap', routerLink: ['/dizilis-onerisi'] },
        { label: 'Personel Kadro', icon: 'pi pi-users', routerLink: ['/personel-kadro'] },
        { label: 'Futbolcu Önerileri', icon: 'pi pi-chart-bar', routerLink: ['/futbolcu-onerileri'] }
      ]
    },

    // Analysis & Comparison
    {
      label: 'Analiz & Karşılaştırma', icon: 'pi pi-search',
      items: [
        { label: 'Rakip Analizi', icon: 'pi pi-users', routerLink: ['/rakip-analizi'] },
        { label: 'Maç Tahmini', icon: 'pi pi-chart-line', routerLink: ['/match-prediction'] }
      ]
    },

    // Statistics & Reports
    {
      label: 'İstatistik & Rapor', icon: 'pi pi-file',
      items: [
        { label: 'Futbolcu İstatistikleri', icon: 'pi pi-chart-bar', routerLink: ['/istatistik'] },
        { label: 'Gözlemci Raporları', icon: 'pi pi-file', routerLink: ['/gozlemci-raporlari'] }
      ]
    },

    // Other Settings & Tools
    {
      label: 'Diğer', icon: 'pi pi-cog',
      items: [
        { label: 'Antrenman Yönetimi', icon: 'pi pi-calendar', routerLink: ['/antrenman-yonetimi'] },
        { label: 'Taktik Tahtası', icon: 'pi pi-pencil', routerLink: ['/taktik-tahtasi'] },
        { label: 'Takım Kimyası', icon: 'pi pi-globe', routerLink: ['/team-chemistry'] },
        { label: 'Sağlık & Form', icon: 'pi pi-heart', routerLink: ['/health-form'] },
       
      ]

    },
    { label: 'Chatbot', icon: 'pi pi-comments', routerLink: ['/chatbot'] },
    { label: 'Ayarlar', icon: 'pi pi-cog', routerLink: ['/settings'] },
   


  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
