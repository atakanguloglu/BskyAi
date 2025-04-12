import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,     
    ChartModule      
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  performanceData: any;
  chartOptions: any;
  players: any[];

  teams = [
    { name: 'Galatasaray', matchesPlayed: 30, wins: 18, draws: 8, losses: 4, points: 62 },
    { name: 'Fenerbahçe', matchesPlayed: 30, wins: 15, draws: 10, losses: 5, points: 55 },
    { name: 'Beşiktaş', matchesPlayed: 30, wins: 14, draws: 11, losses: 5, points: 53 },
    { name: 'Trabzonspor', matchesPlayed: 30, wins: 12, draws: 12, losses: 6, points: 48 },
    // Diğer takımlar...
  ];

  constructor() {
    // Grafik verisi
    this.performanceData = {
      labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
      datasets: [
        {
          label: 'Takım Skoru',
          data: [78, 82, 85, 90, 86, 93],
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

    // Oyuncu verisi
    this.players = [
      {
        name: 'Ahmet Yılmaz',
        goals: 10,
        assists: 5,
        position: 'GK',
        chemistry: 85,
        trainingPerformance: 80, // Antrenman Performansı
        healthStatus: 'Sakatlık Yok', // Sağlık Durumu
        moraleStatus: 'Yüksek', // Moral Durumu
        lastTrainingScore: 90 // Son Antrenman Skoru
      },
      {
        name: 'Mehmet Demir',
        goals: 7,
        assists: 6,
        position: 'DF',
        chemistry: 78,
        trainingPerformance: 70,
        healthStatus: 'Sakatlık Yok',
        moraleStatus: 'Orta',
        lastTrainingScore: 75
      },
      {
        name: 'Can Kaya',
        goals: 12,
        assists: 8,
        position: 'MF',
        chemistry: 90,
        trainingPerformance: 85,
        healthStatus: 'Sakatlık Yok',
        moraleStatus: 'Yüksek',
        lastTrainingScore: 92
      },
      {
        name: 'Ali Veli',
        goals: 15,
        assists: 10,
        position: 'FW',
        chemistry: 92,
        trainingPerformance: 88,
        healthStatus: 'Sakatlık Yok',
        moraleStatus: 'Yüksek',
        lastTrainingScore: 95
      },
      {
        name: 'Kemal Arslan',
        goals: 5,
        assists: 3,
        position: 'MF',
        chemistry: 80,
        trainingPerformance: 65,
        healthStatus: 'Fiziksel Terapi Alıyor',
        moraleStatus: 'Düşük',
        lastTrainingScore: 70
      },
    ];

  }
}
