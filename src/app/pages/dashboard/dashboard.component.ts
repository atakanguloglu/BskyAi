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

  // Takım verileri
  teams = [
    { name: 'Galatasaray', matchesPlayed: 30, wins: 18, draws: 8, losses: 4, points: 62 },
    { name: 'Fenerbahçe', matchesPlayed: 30, wins: 15, draws: 10, losses: 5, points: 55 },
    { name: 'Beşiktaş', matchesPlayed: 30, wins: 14, draws: 11, losses: 5, points: 53 },
    { name: 'Trabzonspor', matchesPlayed: 30, wins: 12, draws: 12, losses: 6, points: 48 },
    // Diğer takımlar...
  ];

  // Yeni eklenen veri modelleri
  upcomingMatches = [
    { homeTeam: 'Galatasaray', awayTeam: 'Beşiktaş', date: new Date('2025-04-25'), competition: 'Süper Lig' },
    { homeTeam: 'Galatasaray', awayTeam: 'Bursaspor', date: new Date('2025-05-02'), competition: 'Türkiye Kupası' },
    { homeTeam: 'Fenerbahçe', awayTeam: 'Galatasaray', date: new Date('2025-05-09'), competition: 'Süper Lig' }
  ];

  injuries = [
    { player: 'Kerem Aktürkoğlu', type: 'Aşil Tendon', severity: 'Uzun Süreli', returnDate: new Date('2025-06-15') },
    { player: 'Lucas Torreira', type: 'Kas Zorlanması', severity: 'Kısa Süreli', returnDate: new Date('2025-04-22') },
    { player: 'Victor Nelsson', type: 'Menisküs', severity: 'Orta Süreli', returnDate: new Date('2025-05-10') }
  ];

  suspensions = [
    { player: 'Mauro Icardi', reason: 'Kırmızı Kart', matches: 1 },
    { player: 'Davinson Sanchez', reason: 'Sarı Kart Cezası', matches: 1 }
  ];

  budget = {
    total: 50000000,
    used: 32500000,
    remaining: 17500000
  };

  transferTargets = [
    { name: 'João Félix', club: 'Atletico Madrid', position: 'FW', value: 35000000, status: 'Görüşme' },
    { name: 'Orkun Kökçü', club: 'Benfica', position: 'MF', value: 22000000, status: 'Takip' },
    { name: 'Mohammed Kudus', club: 'West Ham', position: 'MF', value: 28000000, status: 'İzleme' },
    { name: 'Arda Güler', club: 'Real Madrid', position: 'MF', value: 40000000, status: 'İzleme' }
  ];

  playerFitness = [
    { name: 'Muslera', fitness: 85 },
    { name: 'Icardi', fitness: 92 },
    { name: 'Zaha', fitness: 88 },
    { name: 'Torreira', fitness: 75 },
    { name: 'Davinson', fitness: 90 },
    { name: 'Demirbay', fitness: 82 },
    { name: 'Osimhen', fitness: 55 },
    { name: 'Mertens', fitness: 68 },
    { name: 'Kerem', fitness: 95 },
    { name: 'Bardakçı', fitness: 86 },
    { name: 'Nelsson', fitness: 70 },
    { name: 'Barış A.', fitness: 89 }
  ];

  trainingSchedule = [
    { date: new Date('2025-04-16'), type: 'Teknik', duration: '120 dk' },
    { date: new Date('2025-04-17'), type: 'Taktik', duration: '90 dk' },
    { date: new Date('2025-04-18'), type: 'Kondisyon', duration: '60 dk' },
    { date: new Date('2025-04-19'), type: 'Teknik', duration: '120 dk' },
    { date: new Date('2025-04-20'), type: 'Dinlenme', duration: '0 dk' },
    { date: new Date('2025-04-21'), type: 'Taktik', duration: '90 dk' },
    { date: new Date('2025-04-22'), type: 'Maç', duration: '90 dk' }
  ];

  seasonGoals = [
    { name: 'Süper Lig Şampiyonluğu', current: 62, target: 90, points: true },
    { name: 'Türkiye Kupası', current: 3, target: 6, points: false },
    { name: 'Avrupa Ligi Son 16', current: 1, target: 1, points: false },
    { name: 'Gol Sayısı', current: 45, target: 80, points: false }
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
