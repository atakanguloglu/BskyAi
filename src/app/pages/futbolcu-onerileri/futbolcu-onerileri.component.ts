import { Component } from '@angular/core';
import { NgFor,NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-futbolcu-onerileri',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './futbolcu-onerileri.component.html',
  styleUrls: ['./futbolcu-onerileri.component.scss']

})
export class FutbolcuOnerileriComponent {
  positions = ['GK', 'DF', 'MF', 'FW'];
  selectedPosition: string = '';
  minAge: number = 0;
  maxAge: number = 40;
  minChemistry: number = 0;

  players = [
    { name: 'Ahmet Yılmaz', position: 'GK', age: 28, chemistry: 90 },
    { name: 'Mehmet Demir', position: 'DF', age: 25, chemistry: 85 },
    { name: 'Can Kaya', position: 'MF', age: 22, chemistry: 88 },
    { name: 'Ali Veli', position: 'FW', age: 27, chemistry: 92 },
    { name: 'Kemal Arslan', position: 'MF', age: 30, chemistry: 80 },
  ];

  get filteredPlayers() {
    return this.players.filter(player => {
      return (
        (!this.selectedPosition || player.position === this.selectedPosition) &&
        player.age >= this.minAge &&
        player.age <= this.maxAge &&
        player.chemistry >= this.minChemistry
      );
    });
  }

  resetFilters() {
    this.selectedPosition = '';
    this.minAge = 0;
    this.maxAge = 40;
    this.minChemistry = 0;
  }
}
