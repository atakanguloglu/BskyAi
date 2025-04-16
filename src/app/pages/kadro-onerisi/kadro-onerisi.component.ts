import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';

interface Player {
  name: string;
  position: string;
  chemistry: number;
  form: number;
  rating: string;
  fieldPosition?: {
    top: string;
    left: string;
  };
}

interface PlayerStats {
  name: string;
  stats: number[];
}

@Component({
  selector: 'app-kadro-onerisi',
  standalone: true,
  imports: [CommonModule, ChartModule, FormsModule],
  templateUrl: './kadro-onerisi.component.html',
  styleUrls: ['./kadro-onerisi.component.scss']
})
export class KadroOnerisiComponent {
  // Mevcut kartlar için veriler
  toplamKadro = 25;
  uyumluOyuncular = 20;
  onerilenOyuncular = 5;
  takimDurumu = 'İyi';

  // Grafik verileri
  performanceData: any;
  chartOptions: any;
  comparisonChartData: any;
  radarChartOptions: any;

  // Filtre ve kriter değerleri
  formations = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '5-3-2'];
  playStyles = ['Tiki-Taka', 'Hızlı Hücum', 'Kontra Atak', 'Savunma Ağırlıklı', 'Yüksek Pres'];
  priorities = ['Gençlik', 'Tecrübe', 'Yetenekli Oyuncular', 'Form Durumu', 'Takım Uyumu'];
  selectedFormation = '4-3-3';
  selectedPlayStyle = 'Hızlı Hücum';
  selectedPriority = 'Form Durumu';
  youngPlayerRatio = 30;
  minChemistryScore = 75;

  // Önerilen kadro
  showRecommendation = true; // Demo için true olarak ayarlandı
  recommendedLineup: Player[] = [];
  benchPlayers: Player[] = [];
  averageChemistry = 87;
  averageAge = 24.5;
  recentFormPlayers: string[] = ['Kerem Aktürkoğlu', 'Lucas Torreira'];
  highestChemistryPlayer = 'Mauro Icardi';

  // Karşılaştırma grafiği
  allPositions = ['GK', 'DF', 'MF', 'FW'];
  selectedPositionToCompare = 'MF';

  constructor() {
    // Performans grafiği verisi
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

    // Oyuncu karşılaştırma radar grafiği için options
    this.radarChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 10
        }
      }
    };

    // Varsayılan kadro ve yedek oyuncular
    this.initializeLineups();

    // Karşılaştırma grafiği için varsayılan verileri yükle
    this.updateComparisonChart();
  }

  // Başlangıç kadrosunu hazırla (Görüntülerdeki verilere göre)
  initializeLineups(): void {
    // 4-3-3 formatında örnek kadro
    this.recommendedLineup = [
      { name: 'Muslera', position: 'GK', chemistry: 92, form: 8.5, rating: '8.5', fieldPosition: { top: '92%', left: '50%' } },
      { name: 'Kaan Ayhan', position: 'RB', chemistry: 85, form: 7.8, rating: '7.8', fieldPosition: { top: '75%', left: '18%' } },
      { name: 'Nelsson', position: 'CB', chemistry: 88, form: 8.2, rating: '8.2', fieldPosition: { top: '75%', left: '38%' } },
      { name: 'Abdülkerim', position: 'CB', chemistry: 84, form: 7.5, rating: '7.5', fieldPosition: { top: '75%', left: '62%' } },
      { name: 'Angeliño', position: 'LB', chemistry: 80, form: 7.4, rating: '7.4', fieldPosition: { top: '75%', left: '82%' } },
      { name: 'Torreira', position: 'CDM', chemistry: 90, form: 8.7, rating: '8.7', fieldPosition: { top: '55%', left: '38%' } },
      { name: 'Demirbay', position: 'CDM', chemistry: 83, form: 7.2, rating: '7.2', fieldPosition: { top: '55%', left: '62%' } },
      { name: 'Mertens', position: 'CAM', chemistry: 86, form: 8.0, rating: '8.0', fieldPosition: { top: '40%', left: '50%' } },
      { name: 'Kerem', position: 'RW', chemistry: 89, form: 8.6, rating: '8.6', fieldPosition: { top: '25%', left: '85%' } },
      { name: 'Icardi', position: 'ST', chemistry: 94, form: 9.2, rating: '9.2', fieldPosition: { top: '25%', left: '50%' } },
      { name: 'Zaha', position: 'LW', chemistry: 87, form: 8.3, rating: '8.3', fieldPosition: { top: '25%', left: '15%' } }
    ];

    // Ekran görüntüsündeki gerçek verilere göre yedek oyuncular
    this.benchPlayers = [
      { name: 'Günay', position: 'GK', chemistry: 78, form: 7.0, rating: '7.0' },
      { name: 'Davinson', position: 'CB', chemistry: 82, form: 7.5, rating: '7.5' },
      { name: 'Bardakçı', position: 'CB', chemistry: 80, form: 7.2, rating: '7.2' },
      { name: 'Barış A.', position: 'MF', chemistry: 76, form: 6.8, rating: '6.8' },
      { name: 'Yunus A.', position: 'MF', chemistry: 75, form: 6.5, rating: '6.5' },
      { name: 'Gabriel S.', position: 'FW', chemistry: 79, form: 7.1, rating: '7.1' },
      { name: 'Osimhen', position: 'ST', chemistry: 88, form: 7.8, rating: '7.8' }
    ];
  }

  // Kadro önerisi oluştur
  generateRecommendation(): void {
    this.showRecommendation = true;
    // Görüntülerde farklı formasyon seçimi gösterildiği için, yeniden oyuncuların konumlarını ayarlayalım

    // Seçilen formasyona göre oyuncu pozisyonlarını ayarla
    if (this.selectedFormation === '3-5-2') {
      // 3-5-2 formasyonuna göre oyuncu pozisyonlarını güncelle
      this.updatePositionsFor352Formation();
    } else if (this.selectedFormation === '4-4-2') {
      // 4-4-2 formasyonuna göre oyuncu pozisyonlarını güncelle
      this.updatePositionsFor442Formation();
    } else {
      // Varsayılan 4-3-3 formasyonu için mevcut lineup kullanılır
      this.initializeLineups();
    }

    // Kimya skoru, yaş ortalaması vb değerleri güncelle
    this.updateStats();
  }

  // 3-5-2 formasyonu için oyuncu pozisyonlarını güncelle
  updatePositionsFor352Formation(): void {
    // Önce kadroda bazı değişiklikler yapalım (formasyona uygun oyuncular)
    this.recommendedLineup = [
      { name: 'Muslera', position: 'GK', chemistry: 92, form: 8.5, rating: '8.5', fieldPosition: { top: '92%', left: '50%' } },
      { name: 'Nelsson', position: 'CB', chemistry: 88, form: 8.2, rating: '8.2', fieldPosition: { top: '75%', left: '30%' } },
      { name: 'Davinson', position: 'CB', chemistry: 82, form: 7.5, rating: '7.5', fieldPosition: { top: '75%', left: '50%' } },
      { name: 'Abdülkerim', position: 'CB', chemistry: 84, form: 7.5, rating: '7.5', fieldPosition: { top: '75%', left: '70%' } },
      { name: 'Barış A.', position: 'RWB', chemistry: 76, form: 6.8, rating: '6.8', fieldPosition: { top: '60%', left: '15%' } },
      { name: 'Torreira', position: 'CM', chemistry: 90, form: 8.7, rating: '8.7', fieldPosition: { top: '55%', left: '35%' } },
      { name: 'Demirbay', position: 'CM', chemistry: 83, form: 7.2, rating: '7.2', fieldPosition: { top: '55%', left: '50%' } },
      { name: 'Angeliño', position: 'LWB', chemistry: 80, form: 7.4, rating: '7.4', fieldPosition: { top: '60%', left: '85%' } },
      { name: 'Mertens', position: 'CAM', chemistry: 86, form: 8.0, rating: '8.0', fieldPosition: { top: '40%', left: '50%' } },
      { name: 'Icardi', position: 'ST', chemistry: 94, form: 9.2, rating: '9.2', fieldPosition: { top: '25%', left: '35%' } },
      { name: 'Osimhen', position: 'ST', chemistry: 88, form: 7.8, rating: '7.8', fieldPosition: { top: '25%', left: '65%' } }
    ];

    // Yedeklerin de güncellenmesi
    this.benchPlayers = [
      { name: 'Günay', position: 'GK', chemistry: 78, form: 7.0, rating: '7.0' },
      { name: 'Kaan Ayhan', position: 'CB', chemistry: 85, form: 7.8, rating: '7.8' },
      { name: 'Bardakçı', position: 'CB', chemistry: 80, form: 7.2, rating: '7.2' },
      { name: 'Zaha', position: 'LW', chemistry: 87, form: 8.3, rating: '8.3' },
      { name: 'Kerem', position: 'RW', chemistry: 89, form: 8.6, rating: '8.6' },
      { name: 'Yunus A.', position: 'MF', chemistry: 75, form: 6.5, rating: '6.5' },
      { name: 'Gabriel S.', position: 'FW', chemistry: 79, form: 7.1, rating: '7.1' }
    ];
  }

  // 4-4-2 formasyonu için oyuncu pozisyonlarını güncelle
  updatePositionsFor442Formation(): void {
    this.recommendedLineup = [
      { name: 'Muslera', position: 'GK', chemistry: 92, form: 8.5, rating: '8.5', fieldPosition: { top: '92%', left: '50%' } },
      { name: 'Kaan Ayhan', position: 'RB', chemistry: 85, form: 7.8, rating: '7.8', fieldPosition: { top: '75%', left: '20%' } },
      { name: 'Nelsson', position: 'CB', chemistry: 88, form: 8.2, rating: '8.2', fieldPosition: { top: '75%', left: '40%' } },
      { name: 'Abdülkerim', position: 'CB', chemistry: 84, form: 7.5, rating: '7.5', fieldPosition: { top: '75%', left: '60%' } },
      { name: 'Angeliño', position: 'LB', chemistry: 80, form: 7.4, rating: '7.4', fieldPosition: { top: '75%', left: '80%' } },
      { name: 'Kerem', position: 'RM', chemistry: 89, form: 8.6, rating: '8.6', fieldPosition: { top: '50%', left: '20%' } },
      { name: 'Torreira', position: 'CM', chemistry: 90, form: 8.7, rating: '8.7', fieldPosition: { top: '50%', left: '40%' } },
      { name: 'Demirbay', position: 'CM', chemistry: 83, form: 7.2, rating: '7.2', fieldPosition: { top: '50%', left: '60%' } },
      { name: 'Zaha', position: 'LM', chemistry: 87, form: 8.3, rating: '8.3', fieldPosition: { top: '50%', left: '80%' } },
      { name: 'Icardi', position: 'ST', chemistry: 94, form: 9.2, rating: '9.2', fieldPosition: { top: '25%', left: '40%' } },
      { name: 'Osimhen', position: 'ST', chemistry: 88, form: 7.8, rating: '7.8', fieldPosition: { top: '25%', left: '60%' } }
    ];

    this.benchPlayers = [
      { name: 'Günay', position: 'GK', chemistry: 78, form: 7.0, rating: '7.0' },
      { name: 'Davinson', position: 'CB', chemistry: 82, form: 7.5, rating: '7.5' },
      { name: 'Bardakçı', position: 'CB', chemistry: 80, form: 7.2, rating: '7.2' },
      { name: 'Mertens', position: 'CAM', chemistry: 86, form: 8.0, rating: '8.0' },
      { name: 'Barış A.', position: 'MF', chemistry: 76, form: 6.8, rating: '6.8' },
      { name: 'Yunus A.', position: 'MF', chemistry: 75, form: 6.5, rating: '6.5' },
      { name: 'Gabriel S.', position: 'FW', chemistry: 79, form: 7.1, rating: '7.1' }
    ];
  }

  // Kimya skoru, yaş ortalaması vb değerleri hesapla
  updateStats(): void {
    // Örnek hesaplama - gerçek uygulamada burada daha karmaşık hesaplamalar yapılabilir
    const totalChemistry = this.recommendedLineup.reduce((sum, player) => sum + player.chemistry, 0);
    this.averageChemistry = Math.round(totalChemistry / this.recommendedLineup.length);

    // En yüksek kimya puanına sahip oyuncuyu bul
    const highestChemPlayer = this.recommendedLineup.reduce((prev, current) =>
      (prev.chemistry > current.chemistry) ? prev : current);
    this.highestChemistryPlayer = highestChemPlayer.name;

    // Form durumu iyi olan oyuncuları belirle
    this.recentFormPlayers = this.recommendedLineup
      .filter(player => player.form >= 8.5)
      .map(player => player.name);

    // Diğer istatistikleri güncelle
    if (this.recentFormPlayers.length === 0) {
      this.recentFormPlayers = ['En iyi form gösteren oyuncu yok'];
    }
  }

  // Karşılaştırma grafiğini güncelle
  updateComparisonChart(): void {
    // Seçilen pozisyona göre oyuncuları filtrele
    let playersInPosition: PlayerStats[] = [];

    if (this.selectedPositionToCompare === 'GK') {
      playersInPosition = [
        { name: 'Muslera', stats: [9, 6, 8, 7, 9] },
        { name: 'Günay', stats: [7, 5, 6, 8, 7] }
      ];
    } else if (this.selectedPositionToCompare === 'DF') {
      playersInPosition = [
        { name: 'Nelsson', stats: [8, 9, 7, 6, 7] },
        { name: 'Abdülkerim', stats: [7, 8, 6, 7, 7] },
        { name: 'Davinson', stats: [8, 9, 6, 7, 6] }
      ];
    } else if (this.selectedPositionToCompare === 'MF') {
      playersInPosition = [
        { name: 'Torreira', stats: [7, 6, 9, 9, 8] },
        { name: 'Demirbay', stats: [6, 5, 8, 9, 7] },
        { name: 'Mertens', stats: [8, 5, 9, 8, 7] }
      ];
    } else if (this.selectedPositionToCompare === 'FW') {
      playersInPosition = [
        { name: 'Icardi', stats: [9, 8, 7, 6, 8] },
        { name: 'Zaha', stats: [9, 6, 8, 7, 9] },
        { name: 'Kerem', stats: [9, 5, 8, 7, 8] }
      ];
    }

    // Radar grafiği için veri hazırla
    this.comparisonChartData = {
      labels: ['Hız', 'Güç', 'Teknik', 'Taktik', 'Kondisyon'],
      datasets: playersInPosition.map((player, index) => {
        const colors = [
          { borderColor: '#42A5F5', backgroundColor: 'rgba(66, 165, 245, 0.2)' },
          { borderColor: '#66BB6A', backgroundColor: 'rgba(102, 187, 106, 0.2)' },
          { borderColor: '#FFA726', backgroundColor: 'rgba(255, 167, 38, 0.2)' }
        ];

        return {
          label: player.name,
          data: player.stats,
          fill: true,
          backgroundColor: colors[index % colors.length].backgroundColor,
          borderColor: colors[index % colors.length].borderColor,
          pointBackgroundColor: colors[index % colors.length].borderColor,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors[index % colors.length].borderColor
        };
      })
    };
  }
}
