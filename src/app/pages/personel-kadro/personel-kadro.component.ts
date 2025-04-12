import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';



@Component({
  standalone: true,
  selector: 'app-personel-kadro',
  templateUrl: './personel-kadro.component.html',
  styleUrls: ['./personel-kadro.component.scss'],
  imports: [CommonModule, TableModule, InputTextModule, ButtonModule]
})
export class PersonelKadroComponent {
  searchQuery: string = '';
  personnel = [
    { name: 'Dursun Özbek', workingHours: 132, totalFinished: 6, role: 'Klüp Başkanı' },
    { name: 'Metin Öztürk', workingHours: 10, totalFinished: 3, role: 'Başkan Yardımcısı' },
    { name: 'Niyazi Yelkencioğlu', workingHours: 100, totalFinished: 12, role: 'Teknik Direktör' },
    { name: 'Mehmet Saruhan Cibara', workingHours: 7, totalFinished: 1, role: 'Futbol Direktörü' },
    { name: 'Eray Yazgan', workingHours: 13, totalFinished: 7, role: 'Sportif Direktör' },
    // Daha fazla kişi ekleyebilirsin
  ];

  filteredPersonnel = [...this.personnel];

  onSearchChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredPersonnel = this.personnel.filter(person =>
      person.name.toLowerCase().includes(query)
    );
  }

  copy(person: any) {
    console.log(`Kopyalanan kişi: ${person.name}`);
  }

  edit(person: any) {
    console.log(`Düzenleme başladı: ${person.name}`);
  }

  delete(person: any) {
    console.log(`Silme işlemi: ${person.name}`);
  }
}
