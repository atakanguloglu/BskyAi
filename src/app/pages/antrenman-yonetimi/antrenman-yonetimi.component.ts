import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-antrenman-yonetimi',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './antrenman-yonetimi.component.html',
  styleUrls: ['./antrenman-yonetimi.component.scss']
})
export class AntrenmanYonetimiComponent {
  players = [
    { name: 'Kerem Aktürkoğlu' },
    { name: 'Mauro Icardi' },
    { name: 'Lucas Torreira' }
  ];

  trainingTypes = ['Kuvvet', 'Kondisyon', 'Teknik'];
  selectedPlayers: any[] = [];
  selectedTypes: string[] = [];

  trainingList = [
    { player: 'Kerem Aktürkoğlu', type: 'Kondisyon', date: '2025-04-12' },
    { player: 'Mauro Icardi', type: 'Kuvvet', date: '2025-04-12' }
  ];

  addTraining() {
    if (this.selectedPlayers.length && this.selectedTypes.length) {
      this.selectedPlayers.forEach(player => {
        this.selectedTypes.forEach(type => {
          this.trainingList.push({
            player: player.name,
            type,
            date: new Date().toISOString().split('T')[0]
          });
        });
      });
    }

    this.selectedPlayers = [];
    this.selectedTypes = [];
  }
}
