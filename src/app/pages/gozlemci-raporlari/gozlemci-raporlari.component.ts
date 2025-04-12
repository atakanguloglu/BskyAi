import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-gozlemci-raporlari',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './gozlemci-raporlari.component.html',
  styleUrls: ['./gozlemci-raporlari.component.scss']
})
export class GozlemciRaporlariComponent {
  performanceData: any;
  chartOptions: any;
  players: any[];

  constructor() {
    // Grafik Verisi
    this.performanceData = {
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
      datasets: [
        {
          label: 'Performans Skoru',
          data: [75, 80, 85, 90, 95, 100],
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

    // Oyuncu Verisi
    this.players = [
      { name: 'Ahmet Yılmaz', goals: 10, assists: 5, position: 'GK', teamChemistry: 85, performanceRating: 8, observation: 'İyi performans, iyileştirilmesi gereken noktalar var.' },
      { name: 'Mehmet Demir', goals: 7, assists: 6, position: 'DF', teamChemistry: 80, performanceRating: 7, observation: 'Savunmada etkili, hücumda daha fazla katkı sağlayabilir.' },
      { name: 'Can Kaya', goals: 12, assists: 8, position: 'MF', teamChemistry: 90, performanceRating: 9, observation: 'Çok yüksek performans, takımın yıldızı.' },
      { name: 'Ali Veli', goals: 15, assists: 10, position: 'FW', teamChemistry: 88, performanceRating: 9, observation: 'Hücumda çok etkili, harika iş çıkarıyor.' },
      { name: 'Kemal Arslan', goals: 5, assists: 3, position: 'MF', teamChemistry: 82, performanceRating: 6, observation: 'Performansı biraz düşük, ancak gelişime açık.' }
    ];
  }
}
