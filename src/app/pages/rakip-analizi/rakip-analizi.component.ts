import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rakip-analizi',
  standalone: true,
  imports: [CommonModule, DropdownModule, CardModule, ChartModule, FormsModule],
  templateUrl: './rakip-analizi.component.html',
  styleUrls: ['./rakip-analizi.component.scss']
})
export class RakipAnaliziComponent {
  teams = [
    {
      name: 'Fenerbahçe',
      stats: { goals: 18, possession: 56, passes: 480, tackles: 65, shots: 110 },
      last5: [3, 2, 4, 1, 2]
    },
    {
      name: 'Beşiktaş',
      stats: { goals: 14, possession: 52, passes: 460, tackles: 68, shots: 95 },
      last5: [2, 1, 3, 1, 1]
    },
    {
      name: 'Trabzonspor',
      stats: { goals: 16, possession: 54, passes: 470, tackles: 70, shots: 98 },
      last5: [3, 2, 3, 2, 2]
    }
  ];

  userTeam = {
    name: 'Galatasaray',
    stats: { goals: 20, possession: 60, passes: 510, tackles: 62, shots: 115 },
    last5: [4, 3, 3, 2, 4]
  };

  selectedTeam: any = null;

  statLabels: Record<keyof typeof this.userTeam.stats, string> = {
    goals: 'Goller',
    possession: 'Topla Oynama',
    passes: 'Paslar',
    tackles: 'Top Kapma',
    shots: 'Şutlar'
  };

  statKeys: Array<keyof typeof this.userTeam.stats> = ['goals', 'possession', 'passes', 'tackles', 'shots'];

  get aiComment(): string {
    if (!this.selectedTeam) return '';
    const diff = this.userTeam.stats.goals - this.selectedTeam.stats.goals;
    if (diff > 3) {
      return 'Takımınız hücumda çok üstün, rakip savunması zorlanabilir.';
    } else if (diff < -3) {
      return 'Rakip hücumda daha etkili, savunmanızı güçlendirmelisiniz.';
    } else {
      return 'İki takım oldukça dengeli görünüyor. Orta sahadaki mücadele belirleyici olabilir.';
    }
  }

  get radarChartData() {
    if (!this.selectedTeam) return { labels: [], datasets: [] };

    return {
      labels: this.statKeys.map(k => this.statLabels[k]),
      datasets: [
        {
          label: this.userTeam.name,
          data: this.statKeys.map(k => this.userTeam.stats[k]),
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)'
        },
        {
          label: this.selectedTeam.name,
          data: this.statKeys.map(k => this.selectedTeam.stats[k]),
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)'
        }
      ]
    };
  }

  get barChartData() {
    if (!this.selectedTeam) return { labels: [], datasets: [] };

    return {
      labels: ['1. Maç', '2. Maç', '3. Maç', '4. Maç', '5. Maç'],
      datasets: [
        {
          label: this.userTeam.name,
          data: this.userTeam.last5,
          backgroundColor: '#FF6384'
        },
        {
          label: this.selectedTeam.name,
          data: this.selectedTeam.last5,
          backgroundColor: '#36A2EB'
        }
      ]
    };
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      r: {
        pointLabels: {
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: { font: { size: 12 } }
      },
      y: {
        ticks: { font: { size: 12 } }
      }
    }
  };
}
