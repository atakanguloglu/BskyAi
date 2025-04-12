import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-form.component.html',
  styleUrls: ['./health-form.component.scss']
})
export class HealthFormComponent {
  // Oyuncu verisi
  players = [
    {
      name: 'Ahmet Yılmaz',
      healthStatus: 'İyi',
      lastTrainingStatus: 'Tamamlandı',
      injuries: [
        { type: 'Bacak Kemiği', startDate: new Date('2024-01-01'), recoveryStatus: 80, doctorNotes: 'İyileşiyor' }
      ],
      treatmentPlan: [
        { name: 'Bacak Tedavisi', details: 'Fizik tedavi seansları', startDate: new Date('2024-02-01') }
      ]
    },
    {
      name: 'Mehmet Demir',
      healthStatus: 'Yaralı',
      lastTrainingStatus: 'Yaralı',
      injuries: [
        { type: 'Omuz Sakatlığı', startDate: new Date('2024-01-15'), recoveryStatus: 50, doctorNotes: 'Tedaviye devam ediliyor' }
      ],
      treatmentPlan: [
        { name: 'Omuz Tedavisi', details: 'İlaç tedavisi', startDate: new Date('2024-01-20') }
      ]
    }
  ];

  selectedPlayer: any = null;
  showGeneralDetails: boolean = false;

  // Oyuncu Seçimi
  selectPlayer(player: any) {
    this.selectedPlayer = player;
    this.showGeneralDetails = !this.showGeneralDetails; // Detayları gösterme durumunu değiştir
  }

  // Genel sağlık detaylarını göstermek için
  showGeneralDetailsFn() {
    return this.showGeneralDetails;
  }
}
