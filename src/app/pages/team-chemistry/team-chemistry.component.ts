import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-team-chemistry',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, DropdownModule, FormsModule, DialogModule],
  templateUrl: './team-chemistry.component.html',
  styleUrl: './team-chemistry.component.scss',
})
export class TeamChemistryComponent {
  players = [
    { name: 'Ahmet Yılmaz', country: 'Türkiye', language: 'Türkçe', position: 'Forvet', region: 'Avrupa' },
    { name: 'Carlos Silva', country: 'Brezilya', language: 'Portekizce', position: 'Orta Saha', region: 'Güney Amerika' },
    { name: 'Jean Dupont', country: 'Fransa', language: 'Fransızca', position: 'Defans', region: 'Avrupa' },
    { name: 'Ali Al Habi', country: 'Suudi Arabistan', language: 'Arapça', position: 'Kaleci', region: 'Orta Doğu' },
    { name: 'James Smith', country: 'İngiltere', language: 'İngilizce', position: 'Forvet', region: 'Avrupa' },
    { name: 'Miguel Ortega', country: 'Meksika', language: 'İspanyolca', position: 'Kanat', region: 'Kuzey Amerika' },
  ];

  languages = ['Türkçe', 'Portekizce', 'Fransızca', 'Arapça', 'İngilizce', 'İspanyolca'];
  regions = ['Avrupa', 'Güney Amerika', 'Orta Doğu', 'Kuzey Amerika'];
  positions = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci', 'Kanat'];

  aiComment: string = 'Takım genel olarak iyi bir bölgesel çeşitliliğe sahip. Ancak iletişimde zorluk yaşanabilecek dil farklılıkları mevcut.';
  chemistryScore: number = 74;

  regionChartData = {
    labels: this.regions,
    datasets: [{
      data: this.regions.map(region => this.players.filter(p => p.region === region).length),
      backgroundColor: ['#42A5F5', '#FFCE56', '#66BB6A', '#EC407A'],
    }]
  };

  languageChartData = {
    labels: this.languages,
    datasets: [{
      data: this.languages.map(lang => this.players.filter(p => p.language === lang).length),
      backgroundColor: ['#EF5350', '#FFA726', '#AB47BC', '#26A69A', '#42A5F5', '#FF7043'],
    }]
  };

  positionChartData = {
    labels: this.positions,
    datasets: [{
      data: this.positions.map(pos => this.players.filter(p => p.position === pos).length),
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFCA28', '#8D6E63', '#5C6BC0'],
    }]
  };

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  selectedPositionFilter: string = '';
  filteredPlayers = this.players;

  filterPlayers(): void {
    if (!this.selectedPositionFilter) {
      this.filteredPlayers = [...this.players];
    } else {
      this.filteredPlayers = this.players.filter(p => p.position === this.selectedPositionFilter);
    }
  }

  resetFilters(): void {
    this.selectedPositionFilter = '';
    this.filteredPlayers = this.players;
  }

  getRegionDistributionComment(): string {
    const mostCommonRegion = this.regions
      .map(region => ({ region, count: this.players.filter(p => p.region === region).length }))
      .sort((a, b) => b.count - a.count)[0];
    return `Takımın büyük kısmı ${mostCommonRegion.region} bölgesinden. Bu, saha içi uyumu artırabilir.`;
  }

  getLanguageDiversityComment(): string {
    const diversity = this.languages.filter(lang => this.players.some(p => p.language === lang)).length;
    return diversity > 4
      ? 'Takımda dil çeşitliliği çok fazla. Bu iletişimde zorluk yaratabilir.'
      : 'Dil yapısı oldukça homojen, iletişim açısından avantajlı.';
  }

  getChemistryAdvice(): string {
    if (this.chemistryScore > 80) return 'Kimya oldukça yüksek, mevcut kadro korunabilir.';
    if (this.chemistryScore > 60) return 'Kadroda küçük takviyelerle uyum artırılabilir.';
    return 'Kimya düşük, benzer bölge/dil konuşan oyuncularla değiştirme önerilir.';
  }

  positionMap: Record<string, { top: string; left: string }> = {
    'Kaleci': { top: '92%', left: '50%' },
    'Defans': { top: '70%', left: '50%' },
    'Orta Saha': { top: '50%', left: '50%' },
    'Kanat': { top: '50%', left: '12%' },
    'Forvet': { top: '25%', left: '50%' }
  };


  positionColors: Record<string, string> = {
    'Kaleci': '#065f46',       // Emerald
    'Defans': '#1e3a8a',       // Indigo
    'Orta Saha': '#b45309',    // Amber
    'Kanat': '#7c3aed',        // Purple
    'Forvet': '#dc2626'        // Red
  };

  getPositionChemistry(pos: string): number {
    const playersInPos = this.players.filter(p => p.position === pos);
    if (playersInPos.length === 0) return 0;

    const baseRegion = playersInPos[0].region;
    const sameRegionCount = playersInPos.filter(p => p.region === baseRegion).length;
    const score = Math.round((sameRegionCount / playersInPos.length) * 100);
    return score;
  }

  getChemistryColor(pos: string): string {
    const chem = this.getPositionChemistry(pos);
    if (chem >= 80) return '#10B981';      // yeşil
    if (chem >= 60) return '#FBBF24';      // sarı
    return '#EF4444';                      // kırmızı
  }

  showDialog = false;
  selectedPositionPlayers: any[] = [];
  selectedPositionName: string = '';

  openPositionDetails(position: string): void {
    this.selectedPositionName = position;
    this.selectedPositionPlayers = this.players.filter(p => p.position === position);
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  modalVisible = false;
  selectedPosition: string = '';

  modalPosition = { top: '50%', left: '50%' };

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
  getPlayersByPosition(position: string) {
    return this.players.filter(p => p.position === position);
  }

  getPositionCount(position: string): number {
    return this.players.filter(p => p.position === position).length;
  }


}
