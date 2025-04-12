import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dizilis-onerisi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dizilis-onerisi.component.html',
  styleUrls: ['./dizilis-onerisi.component.scss']
})
export class DizilisOnerisiComponent {
  formations = ['4-4-2', '4-3-3', '3-5-2'];
  selectedFormation = '4-4-2';
  formationLines: string[][] = [];
  benchPlayers: string[] = ['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3', 'Oyuncu 4', 'Oyuncu 5'];
  chemistryScore = 85;

  ngOnInit() {
    this.onFormationChange();
  }

  onFormationChange() {
    const map: { [key: string]: string[][] } = {
      '4-4-2': [['FW', 'FW'], ['MF', 'MF', 'MF', 'MF'], ['DF', 'DF', 'DF', 'DF'], ['GK']],
      '4-3-3': [['FW', 'FW', 'FW'], ['MF', 'MF', 'MF'], ['DF', 'DF', 'DF', 'DF'], ['GK']],
      '3-5-2': [['FW', 'FW'], ['MF', 'MF', 'MF', 'MF', 'MF'], ['DF', 'DF', 'DF'], ['GK']]
    };
    this.formationLines = map[this.selectedFormation];
  }

  draggedPlayer: string | null = null;
  draggedFrom: { lineIndex: number; playerIndex: number } | null = null;

  onDragStart(event: DragEvent, player: string, lineIndex: number, playerIndex: number) {
    this.draggedPlayer = player;
    this.draggedFrom = { lineIndex, playerIndex };
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetLineIndex: number, targetIndex: number) {
    event.preventDefault();
    if (this.draggedPlayer && this.draggedFrom) {
      const sourceLine = this.formationLines[this.draggedFrom.lineIndex];
      const targetLine = this.formationLines[targetLineIndex];

      const temp = targetLine[targetIndex];
      targetLine[targetIndex] = this.draggedPlayer;
      sourceLine[this.draggedFrom.playerIndex] = temp;

      this.draggedPlayer = null;
      this.draggedFrom = null;
    }
  }
}
