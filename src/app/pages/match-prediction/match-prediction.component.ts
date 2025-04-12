import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-match-prediction',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ChartModule,
    CardModule,
    TabViewModule
  ],
  templateUrl: './match-prediction.component.html',
  styleUrls: ['./match-prediction.component.scss']
})
export class MatchPredictionComponent {
  opponent = {
    name: 'Fenerbahçe',
    lastMatches: ['W', 'D', 'W', 'L', 'W']
  };

  outcome = {
    win: 0.48,
    draw: 0.25,
    loss: 0.27
  };

  outcomeChartData = {
    labels: ['Kazanma', 'Beraberlik', 'Kaybetme'],
    datasets: [
      {
        data: [48, 25, 27],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }
    ]
  };

  tactics = {
    formation: '4-2-3-1',
    pressing: 'Yüksek pres',
    defense: 'Alan savunması',
    attack: 'Kanatlardan hızlı atak'
  };

  situational = {
    leading: [
      'Topa sahip olarak oyunu soğutun ve kontra ataklara açık kalmayın.',
      'Savunma dengesini koruyun, faullerden kaçının.'
    ],
    drawing: [
      'Risk almadan kontrollü oynayıp rakibin hatalarını değerlendirin.',
      'Topla oynama yüzdesini yükseltin.'
    ],
    trailing: [
      'Hızlı kanat organizasyonları ve duran top fırsatlarını artırın.',
      'Orta sahada baskı kurarak top kazanmayı deneyin.'
    ]
  };

  possessionData = {
    labels: ['Galatasaray', 'Fenerbahçe'],
    datasets: [
      {
        data: [53, 47],
        backgroundColor: ['#FFC107', '#2196F3']
      }
    ]
  };

  statBarData = {
    labels: ['Şut', 'Pas Başarısı', 'Top Kapma'],
    datasets: [
      {
        label: 'Galatasaray',
        backgroundColor: '#42A5F5',
        data: [15, 82, 14]
      },
      {
        label: 'Fenerbahçe',
        backgroundColor: '#FFA726',
        data: [12, 79, 10]
      }
    ]
  };

  radarData = {
    labels: ['Hücum', 'Savunma', 'Topla Oynama', 'Duran Toplar', 'Pres'],
    datasets: [
      {
        label: 'Galatasaray',
        data: [80, 70, 75, 65, 85],
        fill: true,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)'
      },
      {
        label: 'Fenerbahçe',
        data: [75, 68, 70, 70, 80],
        fill: true,
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: 'rgba(54,162,235,1)'
      }
    ]
  };

  lineup = [
    { position: 'GK', player: 'Muslera', rating: 7.5, reason: 'Deneyimli ve formda kaleci' },
    { position: 'RB', player: 'Boey', rating: 7.2, reason: 'Hızlı ve dinamik sağ bek' },
    { position: 'CB', player: 'Nelsson', rating: 7.6, reason: 'Hava toplarında etkili' },
    { position: 'CB', player: 'Abdülkerim', rating: 7.4, reason: 'İkili mücadelelerde başarılı' },
    { position: 'LB', player: 'Kaan Ayhan', rating: 7.1, reason: 'Defansif katkı yüksek' },
    { position: 'CM', player: 'Torreira', rating: 8.0, reason: 'Orta sahada pres ve top kazanımı' },
    { position: 'CM', player: 'Kerem Demirbay', rating: 7.3, reason: 'Pas dağılımı iyi' },
    { position: 'LW', player: 'Zaha', rating: 7.9, reason: 'Dripling kabiliyeti yüksek' },
    { position: 'CAM', player: 'Mertens', rating: 8.1, reason: 'Yaratıcılık ve pas arası' },
    { position: 'RW', player: 'Kerem Aktürkoğlu', rating: 8.2, reason: 'Hız ve bitiricilik' },
    { position: 'ST', player: 'Icardi', rating: 8.4, reason: 'Gole en yakın isim' }
  ];

  substitutes = [
    { position: 'FW', player: 'Halil Dervişoğlu', reason: 'Sonradan oyuna etki edebilir' },
    { position: 'MF', player: 'Berkan Kutlu', reason: 'Savunma direncini artırır' },
    { position: 'FW', player: 'Ziyech', reason: 'Oyun kurulumuna katkı sağlar' }
  ];

  opponentThreats = [
    { name: 'Sağ Kanat', details: 'Rakip burada hızlı hücumlarla etkili oluyor.' },
    { name: 'Duran Toplar', details: 'Kafa toplarında üstünlük kurabiliyorlar.' },
    { name: 'Karşı Press', details: 'Top kaybı sonrası hızlı baskı yapıyorlar.' }
  ];
}
