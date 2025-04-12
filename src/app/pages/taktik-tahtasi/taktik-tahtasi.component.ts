import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-taktik-tahtasi',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DropdownModule],
  templateUrl: './taktik-tahtasi.component.html',
  styleUrl: './taktik-tahtasi.component.scss'

})


export class TaktikTahtasiComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private currentColor = '#000000';

  // ✅ Kaydedilen taktikler
  savedTactics: { name: string; image: string }[] = [];
  selectedTactic: string = '';

  // ✅ PLATFORM_ID buraya geliyor
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    const image = new Image();
    image.src = './assets/images/Tahta.png';
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    canvas.addEventListener('mousedown', this.startDrawing);
    canvas.addEventListener('mouseup', this.stopDrawing);
    canvas.addEventListener('mouseout', this.stopDrawing);
    canvas.addEventListener('mousemove', this.draw);
  }




  startDrawing = (event: MouseEvent) => {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  };

  draw = (event: MouseEvent) => {
    if (!this.drawing) return;

    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  };

  stopDrawing = () => {
    if (!this.drawing) return;
    this.drawing = false;
    this.ctx.closePath();
  };

  changeColor(color: string): void {
    this.currentColor = color;
  }

  clear(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isPlatformBrowser(this.platformId)) return;

    const image = new Image();
    image.src = './assets/images/Tahta.png';
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }


  // ✅ Taktik Kaydet
  save(): void {
    const name = prompt('Taktiğe bir isim verin:');
    if (name) {
      const image = this.canvasRef.nativeElement.toDataURL('image/png');
      this.savedTactics.push({ name, image });
    }
  }

  // ✅ Taktik Yükle
  loadTactic(name: string): void {
    const tactic = this.savedTactics.find(t => t.name === name);
    if (tactic) {
      const img = new Image();
      img.src = tactic.image;
      img.onload = () => {
        this.clear();
        this.ctx.drawImage(img, 0, 0);
      };
    }
  }



  // (İsteğe bağlı) Geri al fonksiyonu
  undo(): void {
    alert('Geri al özelliği henüz eklenmedi.');
  }
}
