import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-kadro-onerisi',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './kadro-onerisi.component.html',
  styleUrls: ['./kadro-onerisi.component.scss']
})
export class KadroOnerisiComponent {
  toplamKadro = 25;
  uyumluOyuncular = 20;
  onerilenOyuncular = 5;
  takimDurumu = 'İyi';

  performanceData: any;
  chartOptions: any;

  constructor() {
    this.performanceData = {
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
      datasets: [
        {
          label: 'Kadro Performansı',
          data: [50, 60, 70, 80, 75, 90],
          borderColor: '#42A5F5',
          tension: 0.4,
          fill: false
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#374151'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#6B7280' }
        },
        y: {
          ticks: { color: '#6B7280' }
        }
      }
    };
  }
}
