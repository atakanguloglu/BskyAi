import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

interface Player {
  name: string;
  country: string;
  language: string;
  position: string;
  region: string;
  chemistry: number;
}

@Component({
  selector: 'app-team-chemistry',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './team-chemistry.component.html',
  styleUrl: './team-chemistry.component.scss',
})
export class TeamChemistryComponent implements OnInit {
  players: Player[] = [
    { name: 'Ahmet Yılmaz', country: 'Türkiye', language: 'Türkçe', position: 'Forvet', region: 'Avrupa', chemistry: 85 },
    { name: 'Carlos Silva', country: 'Brezilya', language: 'Portekizce', position: 'Orta Saha', region: 'Güney Amerika', chemistry: 75 },
    { name: 'Jean Dupont', country: 'Fransa', language: 'Fransızca', position: 'Defans', region: 'Avrupa', chemistry: 82 },
    { name: 'Ali Al Habi', country: 'Suudi Arabistan', language: 'Arapça', position: 'Kaleci', region: 'Orta Doğu', chemistry: 68 },
    { name: 'James Smith', country: 'İngiltere', language: 'İngilizce', position: 'Forvet', region: 'Avrupa', chemistry: 78 },
    { name: 'Miguel Ortega', country: 'Meksika', language: 'İspanyolca', position: 'Kanat', region: 'Kuzey Amerika', chemistry: 80 },
    { name: 'Toshiro Tanaka', country: 'Japonya', language: 'Japonca', position: 'Orta Saha', region: 'Asya', chemistry: 72 },
    { name: 'Mikhail Petrov', country: 'Rusya', language: 'Rusça', position: 'Defans', region: 'Avrupa', chemistry: 76 },
    { name: 'Kwame Nkrumah', country: 'Gana', language: 'İngilizce', position: 'Kanat', region: 'Afrika', chemistry: 88 },
    { name: 'Pedro Fernandez', country: 'İspanya', language: 'İspanyolca', position: 'Defans', region: 'Avrupa', chemistry: 83 }
  ];

  languages: string[] = ['Türkçe', 'Portekizce', 'Fransızca', 'Arapça', 'İngilizce', 'İspanyolca', 'Japonca', 'Rusça'];
  regions: string[] = ['Avrupa', 'Güney Amerika', 'Orta Doğu', 'Kuzey Amerika', 'Asya', 'Afrika'];
  positions: string[] = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci', 'Kanat'];

  aiComment: string = 'Takım genel olarak iyi bir bölgesel çeşitliliğe sahip. Ancak iletişimde zorluk yaşanabilecek dil farklılıkları mevcut.';
  chemistryScore: number = 76;

  // Oyuncu uyumluluk matrisi için compatibility değerleri
  compatibilityMatrix: number[][] = [];

  regionChartData: any;
  languageChartData: any;
  positionChartData: any;
  chartOptions: any;

  selectedPositionFilter: string = '';
  filteredPlayers: Player[] = [];

  modalVisible: boolean = false;
  selectedPosition: string = '';
  selectedPositionPlayers: Player[] = [];
  modalPosition: { top: string; left: string } = { top: '50%', left: '50%' };

  positionMap: Record<string, { top: string; left: string }> = {
    'Kaleci': { top: '92%', left: '50%' },
    'Defans': { top: '70%', left: '50%' },
    'Orta Saha': { top: '50%', left: '50%' },
    'Kanat': { top: '30%', left: '12%' },
    'Forvet': { top: '25%', left: '50%' }
  };

  positionColors: Record<string, string> = {
    'Kaleci': '#065f46',       // Emerald
    'Defans': '#1e3a8a',       // Indigo
    'Orta Saha': '#b45309',    // Amber
    'Kanat': '#7c3aed',        // Purple
    'Forvet': '#dc2626'        // Red
  };

  constructor() {
    this.filteredPlayers = [...this.players];
  }

  ngOnInit(): void {
    this.initializeCompatibilityMatrix();
    this.updateChartData();
    this.initializeChartOptions();
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 11
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      animation: {
        duration: 1000
      }
    };
  }

  initializeCompatibilityMatrix(): void {
    // 6x6 matris oluştur
    const playersSubset = this.players.slice(0, 6);
    this.compatibilityMatrix = Array(playersSubset.length).fill(0).map(() => Array(playersSubset.length).fill(0));

    // Matris değerlerini doldur
    for (let i = 0; i < playersSubset.length; i++) {
      for (let j = 0; j < playersSubset.length; j++) {
        if (i === j) {
          this.compatibilityMatrix[i][j] = 100; // Kendisiyle uyumu
        } else {
          // İki oyuncunun uyumunu hesapla
          this.compatibilityMatrix[i][j] = this.calculateCompatibility(playersSubset[i], playersSubset[j]);
        }
      }
    }
  }

  calculateCompatibility(player1: Player, player2: Player): number {
    let score = 50; // Temel skor

    // Aynı bölgeden +20
    if (player1.region === player2.region) {
      score += 20;
    }

    // Aynı dil +15
    if (player1.language === player2.language) {
      score += 15;
    }

    // Yakın pozisyonlar arası +10 (örneğin forvet ve kanat)
    const relatedPositions: { [key: string]: string[] } = {
      'Forvet': ['Kanat', 'Orta Saha'],
      'Kanat': ['Forvet', 'Orta Saha'],
      'Orta Saha': ['Forvet', 'Kanat', 'Defans'],
      'Defans': ['Orta Saha', 'Kaleci'],
      'Kaleci': ['Defans']
    };

    if (relatedPositions[player1.position] && relatedPositions[player1.position].includes(player2.position)) {
      score += 10;
    }

    // Rastgele değişkenlik ekle (-5 to +5)
    score += Math.floor(Math.random() * 11) - 5;

    // 0-100 aralığına sınırla
    return Math.max(0, Math.min(100, score));
  }

  getMatrixPlayers(): Player[] {
    return this.players.slice(0, 6);
  }

  getPlayerFirstName(fullName: string): string {
    return fullName.split(' ')[0];
  }

  getPlayerCompatibility(i: number, j: number): number {
    return this.compatibilityMatrix[i][j];
  }

  getCompatibilityClass(i: number, j: number): string {
    const value = this.compatibilityMatrix[i][j];
    if (value >= 80) {
      return 'bg-green-600';
    } else if (value >= 60) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  }

  updateChartData(): void {
    // Bölge dağılımı grafiği
    this.regionChartData = {
      labels: this.regions,
      datasets: [{
        data: this.regions.map(region => this.getRegionPlayerCount(region)),
        backgroundColor: ['#42A5F5', '#FFCE56', '#66BB6A', '#EC407A', '#AB47BC', '#FFA726'],
      }]
    };

    // Dil dağılımı grafiği
    this.languageChartData = {
      labels: this.getUsedLanguages(),
      datasets: [{
        data: this.getUsedLanguages().map(lang => this.getLanguagePlayerCount(lang)),
        backgroundColor: ['#EF5350', '#FFA726', '#AB47BC', '#26A69A', '#42A5F5', '#FF7043', '#7E57C2', '#66BB6A'],
      }]
    };

    // Pozisyon dağılımı grafiği
    this.positionChartData = {
      labels: this.positions,
      datasets: [{
        label: 'Oyuncu Sayısı',
        data: this.positions.map(pos => this.getPositionPlayerCount(pos)),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFCA28', '#8D6E63', '#5C6BC0'],
      }]
    };
  }

  getRegionPlayerCount(region: string): number {
    return this.players.filter(p => p.region === region).length;
  }

  getLanguagePlayerCount(language: string): number {
    return this.players.filter(p => p.language === language).length;
  }

  getPositionPlayerCount(position: string): number {
    return this.players.filter(p => p.position === position).length;
  }

  getUsedLanguages(): string[] {
    return this.languages.filter(lang => this.players.some(p => p.language === lang));
  }

  isLanguageUsed(language: string): boolean {
    return this.players.some(p => p.language === language);
  }

  getRegionFirstLetter(region: string): string {
    return region.substring(0, 1);
  }

  getRegionBarHeight(region: string): string {
    const regionPlayerCount = this.getRegionPlayerCount(region);
    const heightRem = (regionPlayerCount / this.players.length * 12);
    return heightRem + 'rem';
  }

  getChemistryScoreClass(): any {
    return {
      'text-green-600': this.chemistryScore >= 80,
      'text-yellow-500': this.chemistryScore >= 60 && this.chemistryScore < 80,
      'text-red-500': this.chemistryScore < 60
    };
  }

  getPlayerChemistryClass(player: Player): any {
    return {
      'bg-green-100 text-green-800': player.chemistry > 85,
      'bg-yellow-100 text-yellow-800': player.chemistry <= 85 && player.chemistry > 70,
      'bg-red-100 text-red-800': player.chemistry <= 70
    };
  }

  getPlayerProgressBarClass(player: Player): any {
    return {
      'bg-green-500': player.chemistry >= 80,
      'bg-yellow-500': player.chemistry >= 60 && player.chemistry < 80,
      'bg-red-500': player.chemistry < 60
    };
  }

  getPlayerModalClass(player: Player): any {
    return {
      'bg-green-100 text-green-800': player.chemistry > 85,
      'bg-yellow-100 text-yellow-800': player.chemistry <= 85 && player.chemistry > 70,
      'bg-red-100 text-red-800': player.chemistry <= 70
    };
  }

  getPlayerChemistryValue(player: Player): number {
    return player.chemistry || 70;
  }

  getTopPlayers(count: number): Player[] {
    return [...this.players].sort((a, b) => b.chemistry - a.chemistry).slice(0, count);
  }

  getDotArray(): number[] {
    return [1, 2, 3];
  }

  getPositionStyle(position: string): any {
    return {
      top: this.positionMap[position].top,
      left: this.positionMap[position].left,
      transform: 'translate(-50%, -50%)',
      'background-color': this.getPositionColor(position)
    };
  }

  filterPlayers(): void {
    if (!this.selectedPositionFilter) {
      this.filteredPlayers = [...this.players];
    } else {
      this.filteredPlayers = this.players.filter(p => p.position === this.selectedPositionFilter);
    }
  }

  resetFilters(): void {
    this.selectedPositionFilter = '';
    this.filteredPlayers = [...this.players];
  }

  getRegionDistributionComment(): string {
    const regionCounts = this.regions
      .map(region => ({ region, count: this.getRegionPlayerCount(region) }))
      .sort((a, b) => b.count - a.count);

    const mostCommonRegion = regionCounts[0];
    const secondMostCommon = regionCounts[1];

    if (mostCommonRegion.count > this.players.length / 2) {
      return `Takımın ${mostCommonRegion.count} oyuncusu ${mostCommonRegion.region} bölgesinden. Bu güçlü bir kültürel uyum sağlayabilir.`;
    } else if (mostCommonRegion.count + secondMostCommon.count > this.players.length * 0.7) {
      return `${mostCommonRegion.region} ve ${secondMostCommon.region} oyuncular çoğunlukta. Takımda dengeli bir bölgesel dağılım var.`;
    } else {
      return `Takım çok çeşitli bölgelerden oyunculara sahip. Bu zenginlik sağlayabilir ancak uyum çalışmaları gerekebilir.`;
    }
  }

  getLanguageDiversityComment(): string {
    const uniqueLanguages = new Set(this.players.map(p => p.language)).size;
    const languageCounts = this.languages
      .map(lang => ({ language: lang, count: this.getLanguagePlayerCount(lang) }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    const dominantLanguage = languageCounts[0];

    if (uniqueLanguages > 5) {
      return `${uniqueLanguages} farklı dil mevcut. Bu durum iletişimde zorluk yaratabilir, dil kursları düşünülebilir.`;
    } else if (dominantLanguage && dominantLanguage.count > this.players.length / 2) {
      return `Çoğunluk (${dominantLanguage.count} oyuncu) ${dominantLanguage.language} konuşuyor. Bu temel iletişim için avantaj sağlar.`;
    } else {
      return `Dengeli bir dil dağılımı var. Ortak bir dile odaklanmak faydalı olabilir.`;
    }
  }

  getChemistryAdvice(): string {
    if (this.chemistryScore > 80) return 'Kimya oldukça yüksek, mevcut kadro korunabilir.';
    if (this.chemistryScore > 60) return 'Kadroda küçük takviyelerle uyum artırılabilir.';
    return 'Kimya düşük, benzer bölge/dil konuşan oyuncularla değiştirme önerilir.';
  }

  getPositionChemistry(pos: string): number {
    const playersInPos = this.players.filter(p => p.position === pos);
    if (playersInPos.length === 0) return 0;

    // Oyuncuların ortalama uyum puanını hesapla
    const avgChemistry = playersInPos.reduce((sum, p) => sum + (p.chemistry || 70), 0) / playersInPos.length;

    // Aynı bölgeden oyuncuların oranını hesapla
    const regions = playersInPos.map(p => p.region);
    const uniqueRegions = [...new Set(regions)];
    const regionCounts = uniqueRegions.map(r => ({
      region: r,
      count: regions.filter(reg => reg === r).length
    }));

    const dominantRegion = regionCounts.sort((a, b) => b.count - a.count)[0];

    const regionBonus = dominantRegion ? (dominantRegion.count / playersInPos.length) * 20 : 0;

    // Benzer şekilde dil bonusu
    const languages = playersInPos.map(p => p.language);
    const uniqueLanguages = [...new Set(languages)];
    const languageCounts = uniqueLanguages.map(l => ({
      language: l,
      count: languages.filter(lang => lang === l).length
    }));

    const dominantLanguage = languageCounts.sort((a, b) => b.count - a.count)[0];

    const languageBonus = dominantLanguage ? (dominantLanguage.count / playersInPos.length) * 15 : 0;

    // Toplam skor (ağırlıklı)
    return Math.round(avgChemistry * 0.7 + regionBonus + languageBonus);
  }

  getPositionColor(pos: string): string {
    const chemistry = this.getPositionChemistry(pos);
    if (chemistry >= 80) return '#10B981';      // yeşil
    if (chemistry >= 60) return '#FBBF24';      // sarı
    return '#EF4444';                      // kırmızı
  }

  openPositionModal(position: string, event: MouseEvent): void {
    this.selectedPosition = position;
    this.selectedPositionPlayers = this.getPlayersByPosition(position);
    this.modalVisible = true;

    // Tıklama konumuna göre modal konumunu ayarla
    this.modalPosition = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`
    };
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  getPlayersByPosition(position: string): Player[] {
    return this.players.filter(p => p.position === position);
  }

  getPositionCount(position: string): number {
    return this.players.filter(p => p.position === position).length;
  }
}
