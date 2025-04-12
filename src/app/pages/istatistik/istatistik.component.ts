import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-istatistik',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './istatistik.component.html',
  styleUrls: ['./istatistik.component.scss']
})
export class IstatistikComponent {
  // Oyuncu verisi
  players = [
    { name: 'Ahmet Yılmaz', goals: 10, assists: 5, shots: 15, passes: 20 },
    { name: 'Mehmet Demir', goals: 5, assists: 10, shots: 10, passes: 25 },
    // Diğer oyuncular...
  ];

  // Performans Grafiği Verisi
  performanceData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan'],
    datasets: [{
      label: 'Gol Sayısı',
      data: [5, 6, 7, 8],
      borderColor: '#42A5F5',
      fill: false
    }]
  };

  // Karşılaştırma Grafiği Verisi
  comparisonData = {
    labels: ['Ahmet', 'Mehmet'],
    datasets: [{
      label: 'Goller',
      data: [10, 5],
      backgroundColor: ['#42A5F5', '#66BB6A'],
      borderColor: ['#42A5F5', '#66BB6A'],
      borderWidth: 1
    }]
  };

  // Takım İstatistikleri
  totalMatches = 30;
  winRate = 60;
  lostMatches = 10;
  goalDifference = 15;

  // Grafiğin ayarları
  chartOptions = {
    responsive: true,
    scales: {
      x: { ticks: { color: '#374151' } },
      y: { ticks: { color: '#374151' } }
    }
  };

  comparisonOptions = {
    responsive: true,
    scales: {
      x: { ticks: { color: '#374151' } },
      y: { ticks: { color: '#374151' } }
    }
  };

  // Oyuncu Detaylarını Gösterme
  showPlayerDetails(player: any) {
    // Oyuncu detaylarını ekranda göstermek için basit bir modal ekleyebiliriz.
    alert(`Oyuncu: ${player.name}\nGoller: ${player.goals}\nAsistler: ${player.assists}`);
  }
}
