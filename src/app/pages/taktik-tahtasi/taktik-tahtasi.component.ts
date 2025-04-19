import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

// Pen çizgileri için ek veri yapısı
interface PenLine {
  id: number;
  points: { x: number, y: number }[];
  color: string;
  width: number;
}

interface TacticState {
  imageData: string;
  name: string;
  date: Date;
  players: Player[];
  arrows: Arrow[];
  circles: Circle[];
  penLines: PenLine[]; // Kalem çizgileri
}

interface Player {
  id: number;
  x: number;
  y: number;
  team: 'home' | 'away';
  number: number;
  name: string;
  dragging: boolean;
  color: string;
}

interface Arrow {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  width: number;
}

interface Circle {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  width: number;
}

type DrawingMode = 'pen' | 'arrow' | 'player' | 'circle' | 'eraser';

@Component({
  selector: 'app-taktik-tahtasi',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    SelectButtonModule,
    ColorPickerModule,
    SliderModule,
    InputTextModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './taktik-tahtasi.component.html',
  styleUrls: ['./taktik-tahtasi.component.scss']
})
export class TaktikTahtasiComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas') backgroundCanvasRef!: ElementRef<HTMLCanvasElement>;

  onDrawingModeChange(mode: DrawingMode): void {
    this.drawingMode = mode;

    // Mod değişiminde genel temizleme
    this.drawing = false;
    this.selectedPlayer = null;
    this.isCreatingArrow = false;
    this.isCreatingCircle = false;
    this.tempArrow = null;
    this.tempCircle = null;

    // Canvas'ı yeniden çiz
    this.redrawCanvas();
  }

  // Canvas and drawing variables
  private ctx!: CanvasRenderingContext2D;
  private bgCtx!: CanvasRenderingContext2D;
  private drawing = false;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private currentPath: { x: number, y: number }[] = [];

  // Field dimensions
  private fieldWidth = 1050;
  private fieldHeight = 680;
  private scale = 1;

  // Drawing settings
  currentColor = '#000000';
  currentLineWidth = 2;
  drawingMode: DrawingMode = 'pen';
  availableColors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff'];
  drawingModeOptions = [
    { label: 'Kalem', value: 'pen', icon: 'pi pi-pencil' },
    { label: 'Ok', value: 'arrow', icon: 'pi pi-arrow-right' },
    { label: 'Oyuncu', value: 'player', icon: 'pi pi-user' },
    { label: 'Daire', value: 'circle', icon: 'pi pi-circle' },
    { label: 'Silgi', value: 'eraser', icon: 'pi pi-trash' }
  ];

  // Team settings
  homeTeamColor = '#ff0000';
  awayTeamColor = '#0000ff';

  // Players and objects
  players: Player[] = [];
  arrows: Arrow[] = [];
  circles: Circle[] = [];
  penLines: PenLine[] = [];
  nextPlayerId = 1;
  nextArrowId = 1;
  nextCircleId = 1;
  nextPenLineId = 1;
  selectedPlayer: Player | null = null;
  selectedPlayerNumber = 1;
  selectedPlayerName = '';
  isCreatingArrow = false;
  tempArrow: { startX: number; startY: number; endX: number; endY: number } | null = null;
  isCreatingCircle = false;
  tempCircle: { x: number; y: number; radius: number } | null = null;

  // Tactics management
  savedTactics: TacticState[] = [];
  selectedTactic: TacticState | null = null;
  showSaveDialog = false;
  newTacticName = '';

  // Undo/Redo
  undoStack: TacticState[] = [];
  redoStack: TacticState[] = [];

  // Mouse and touch events
  canvasRect: DOMRect | null = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Initialize main canvas
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Initialize background canvas
    const bgCanvas = this.backgroundCanvasRef.nativeElement;
    this.bgCtx = bgCanvas.getContext('2d')!;

    // Set canvas dimensions
    canvas.width = this.fieldWidth;
    canvas.height = this.fieldHeight;
    bgCanvas.width = this.fieldWidth;
    bgCanvas.height = this.fieldHeight;

    // Draw background field
    this.drawBackgroundField();

    // Get canvas position
    this.updateCanvasRect();

    // Mouse event listeners
    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));

    // Touch event listeners
    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // Load saved tactics
    this.loadSavedTactics();

    // Save initial state
    this.saveState();
  }

 

  private drawPenLine(line: PenLine): void {
    if (!this.ctx || line.points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(line.points[0].x, line.points[0].y);

    for (let i = 1; i < line.points.length; i++) {
      this.ctx.lineTo(line.points[i].x, line.points[i].y);
    }

    this.ctx.strokeStyle = line.color;
    this.ctx.lineWidth = line.width;
    this.ctx.stroke();
  }


  private saveState(): void {
    const state: TacticState = {
      imageData: this.canvasRef.nativeElement.toDataURL('image/png'),
      name: 'Durum ' + this.undoStack.length,
      date: new Date(),
      players: [...this.players],
      arrows: [...this.arrows],
      circles: [...this.circles],
      penLines: [...this.penLines]
    };

    this.undoStack.push(state);
    this.redoStack = [];
  }

  private loadState(state: TacticState): void {
    this.players = [...state.players];
    this.arrows = [...state.arrows];
    this.circles = [...state.circles];
    this.penLines = [...(state.penLines || [])];

    // Reset IDs
    this.nextPlayerId = Math.max(...this.players.map(p => p.id), 0) + 1;
    this.nextArrowId = Math.max(...this.arrows.map(a => a.id), 0) + 1;
    this.nextCircleId = Math.max(...this.circles.map(c => c.id), 0) + 1;
    this.nextPenLineId = Math.max(...(this.penLines.map(p => p.id) || [0]), 0) + 1;

    this.redrawCanvas();
  }

  clear(): void {
    this.players = [];
    this.arrows = [];
    this.circles = [];
    this.penLines = [];
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.saveState();
  }
  saveTactic(): void {
    if (!this.newTacticName) {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata',
        detail: 'Lütfen bir taktik adı girin'
      });
      return;
    }

    const tactic: TacticState = {
      imageData: this.canvasRef.nativeElement.toDataURL('image/png'),
      name: this.newTacticName,
      date: new Date(),
      players: [...this.players],
      arrows: [...this.arrows],
      circles: [...this.circles],
      penLines: [...this.penLines]
    };

    this.savedTactics.push(tactic);
    this.saveTacticsToStorage();

    this.showSaveDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Taktik kaydedildi: ' + this.newTacticName
    });
  }

  private saveTacticsToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const tacticsToSave = this.savedTactics.map(tactic => ({
        imageData: tactic.imageData,
        name: tactic.name,
        date: tactic.date.toISOString(),
        players: tactic.players,
        arrows: tactic.arrows,
        circles: tactic.circles,
        penLines: tactic.penLines || []
      }));

      localStorage.setItem('savedTactics', JSON.stringify(tacticsToSave));
    }
  }

  private loadSavedTactics(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('savedTactics');

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          this.savedTactics = parsed.map((item: any) => ({
            imageData: item.imageData,
            name: item.name,
            date: new Date(item.date),
            players: item.players || [],
            arrows: item.arrows || [],
            circles: item.circles || [],
            penLines: item.penLines || []
          }));
        } catch (e) {
          console.error('Kaydedilen taktikler yüklenemedi:', e);
        }
      }
    }
  }

  // ngOnDestroy metodu
  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Clean up event listeners
    const canvas = this.canvasRef.nativeElement;
    canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    canvas.removeEventListener('mouseleave', this.handleMouseUp.bind(this));

    canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  // Canvas yeniden çizim metodu
  private redrawCanvas(): void {
    if (!this.ctx) return;

    const { width, height } = this.canvasRef.nativeElement;

    // Canvas'ı temizle
    this.ctx.clearRect(0, 0, width, height);

    // Tüm elementleri çiz
    this.drawAllElements();
  }

  // Oyuncu çizim metodu
  private drawPlayer(player: Player): void {
    if (!this.ctx) return;

    const { x, y, team, number, name } = player;
    const color = player.color || (team === 'home' ? this.homeTeamColor : this.awayTeamColor);
    const radius = 15;

    // Oyuncu dairesi
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Oyuncu numarası
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(number.toString(), x, y);

    // Oyuncu adı (varsa)
    if (name) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(name, x, y + radius + 12);
    }

    // Seçili oyuncuyu vurgula
    if (this.selectedPlayer === player) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
      this.ctx.strokeStyle = '#ffff00';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }

  // Ok çizimi
  private drawArrow(arrow: Arrow): void {
    if (!this.ctx) return;

    const { startX, startY, endX, endY, color, width } = arrow;
    const headLength = 15;
    const angle = Math.atan2(endY - startY, endX - startX);

    // Ok çizgisi
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.stroke();

    // Ok başı
    this.ctx.beginPath();
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.lineTo(endX, endY);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  // Geçici ok çizimi
  private drawTempArrow(): void {
    if (!this.ctx || !this.tempArrow) return;

    const { startX, startY, endX, endY } = this.tempArrow;
    const headLength = 15;
    const angle = Math.atan2(endY - startY, endX - startX);

    // Ok çizgisi
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.currentLineWidth;
    this.ctx.stroke();

    // Ok başı
    this.ctx.beginPath();
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.lineTo(endX, endY);
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fill();
  }

  // Daire çizimi
  private drawCircle(circle: Circle): void {
    if (!this.ctx) return;

    const { x, y, radius, color, width } = circle;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.stroke();
  }

  // Geçici daire çizimi
  private drawTempCircle(): void {
    if (!this.ctx || !this.tempCircle) return;

    const { x, y, radius } = this.tempCircle;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.currentLineWidth;
    this.ctx.stroke();
  }

  // Arka plan sahayı çizme
  private drawBackgroundField(): void {
    if (!this.bgCtx) return;

    const { width, height } = this.backgroundCanvasRef.nativeElement;

    // Saha arka planı
    this.bgCtx.fillStyle = '#2e7d32';
    this.bgCtx.fillRect(0, 0, width, height);

    // Çim deseni
    this.drawGrassPattern();

    // Saha çizgileri
    this.bgCtx.strokeStyle = '#ffffff';
    this.bgCtx.lineWidth = 2;

    // Saha sınırı
    this.bgCtx.strokeRect(50, 50, width - 100, height - 100);

    // Orta çizgi
    this.bgCtx.beginPath();
    this.bgCtx.moveTo(width / 2, 50);
    this.bgCtx.lineTo(width / 2, height - 50);
    this.bgCtx.stroke();

    // Orta daire
    this.bgCtx.beginPath();
    this.bgCtx.arc(width / 2, height / 2, 60, 0, Math.PI * 2);
    this.bgCtx.stroke();

    // Orta nokta
    this.bgCtx.beginPath();
    this.bgCtx.arc(width / 2, height / 2, 3, 0, Math.PI * 2);
    this.bgCtx.fillStyle = '#ffffff';
    this.bgCtx.fill();

    // Sol ceza sahası
    this.bgCtx.strokeRect(50, height / 2 - 110, 132, 220);

    // Sol kale sahası
    this.bgCtx.strokeRect(50, height / 2 - 55, 55, 110);

    // Sol kale
    this.bgCtx.strokeRect(40, height / 2 - 35, 10, 70);

    // Sağ ceza sahası
    this.bgCtx.strokeRect(width - 182, height / 2 - 110, 132, 220);

    // Sağ kale sahası
    this.bgCtx.strokeRect(width - 105, height / 2 - 55, 55, 110);

    // Sağ kale
    this.bgCtx.strokeRect(width - 50, height / 2 - 35, 10, 70);

    // Sol penaltı noktası
    this.bgCtx.beginPath();
    this.bgCtx.arc(132, height / 2, 3, 0, Math.PI * 2);
    this.bgCtx.fill();

    // Sağ penaltı noktası
    this.bgCtx.beginPath();
    this.bgCtx.arc(width - 132, height / 2, 3, 0, Math.PI * 2);
    this.bgCtx.fill();

    // Sol köşe yayları
    this.bgCtx.beginPath();
    this.bgCtx.arc(50, 50, 10, 0, Math.PI / 2);
    this.bgCtx.stroke();
    this.bgCtx.beginPath();
    this.bgCtx.arc(50, height - 50, 10, Math.PI * 1.5, Math.PI * 2);
    this.bgCtx.stroke();

    // Sağ köşe yayları
    this.bgCtx.beginPath();
    this.bgCtx.arc(width - 50, 50, 10, Math.PI / 2, Math.PI);
    this.bgCtx.stroke();
    this.bgCtx.beginPath();
    this.bgCtx.arc(width - 50, height - 50, 10, Math.PI, Math.PI * 1.5);
    this.bgCtx.stroke();
  }

  // Method for drawing grass pattern on the field
  private drawGrassPattern(): void {
    if (!this.bgCtx) return;

    const { width, height } = this.backgroundCanvasRef.nativeElement;

    // Light green stripes for grass effect
    this.bgCtx.fillStyle = '#2e7d32';
    this.bgCtx.fillRect(0, 0, width, height);

    // Draw alternating darker green stripes
    this.bgCtx.fillStyle = '#266e2b';
    const stripeWidth = 50;

    for (let i = 0; i < width; i += stripeWidth * 2) {
      this.bgCtx.fillRect(i, 0, stripeWidth, height);
    }
  }

  // Start drawing based on the current mode
  private startDrawing(x: number, y: number): void {
    // Çizim başlangıcını ayarla
    this.drawing = true;
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;

    // Çizim moduna göre farklı davranışlar
    switch (this.drawingMode) {
      case 'pen':
        // Yeni kalem yolu başlat
        this.currentPath = [{ x, y }];
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentLineWidth;
        break;

      case 'arrow':
        // Ok çizmeye başla
        this.isCreatingArrow = true;
        this.tempArrow = {
          startX: x,
          startY: y,
          endX: x,
          endY: y
        };
        break;

      case 'circle':
        // Daire çizmeye başla
        this.isCreatingCircle = true;
        this.tempCircle = {
          x,
          y,
          radius: 0
        };
        break;

      case 'player':
        // Mevcut oyuncuyu seç veya yeni oyuncu ekle
        const clickedPlayer = this.players.find(player => {
          const dx = player.x - x;
          const dy = player.y - y;
          return Math.sqrt(dx * dx + dy * dy) <= 20; // Oyuncu yarıçapını biraz artırdım
        });

        if (clickedPlayer) {
          // Mevcut oyuncuyu seç
          this.selectedPlayer = clickedPlayer;
          clickedPlayer.dragging = true;
        } else if (this.drawingMode === 'player') {
          // Yeni oyuncu oluştur
          const newPlayer: Player = {
            id: this.nextPlayerId++,
            x,
            y,
            team: 'home',
            number: this.selectedPlayerNumber || this.players.length + 1,
            name: this.selectedPlayerName || `Oyuncu ${this.players.length + 1}`,
            dragging: false,
            color: this.homeTeamColor
          };

          this.players.push(newPlayer);
          this.selectedPlayer = newPlayer;
          this.saveState();
        }
        break;

      case 'eraser':
        // Nesneleri silme
        this.checkForErasure(x, y);
        break;
    }

    // Canvas'ı yeniden çiz
    this.redrawCanvas();
  }

  // Continue drawing when mouse or finger moves
  private drawAllElements(): void {
    // Tüm elemanları tek seferde çiz
    this.penLines.forEach(line => this.drawPenLine(line));
    this.circles.forEach(circle => this.drawCircle(circle));
    this.arrows.forEach(arrow => this.drawArrow(arrow));
    this.players.forEach(player => this.drawPlayer(player));

    // Geçici elemanları çiz
    if (this.isCreatingArrow && this.tempArrow) {
      this.drawTempArrow();
    }

    if (this.isCreatingCircle && this.tempCircle) {
      this.drawTempCircle();
    }
  }

  private continueDrawing(x: number, y: number): void {
    if (!this.drawing) return;

    // Canvas'ı temizle ve arka plan elemanlarını yeniden çiz
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.drawAllElements();

    switch (this.drawingMode) {
      case 'pen':
        // Anlık çizgi çizimi
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);

        for (let i = 1; i < this.currentPath.length; i++) {
          this.ctx.lineTo(this.currentPath[i].x, this.currentPath[i].y);
        }

        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentLineWidth;
        this.ctx.stroke();

        // Geçerli yolu güncelle
        this.currentPath.push({ x, y });
        break;

      case 'arrow':
        if (this.tempArrow) {
          this.tempArrow.endX = x;
          this.tempArrow.endY = y;
        }
        break;

      case 'circle':
        if (this.tempCircle) {
          const dx = x - this.tempCircle.x;
          const dy = y - this.tempCircle.y;
          this.tempCircle.radius = Math.sqrt(dx * dx + dy * dy);
        }
        break;

      case 'player':
        if (this.selectedPlayer && this.selectedPlayer.dragging) {
          this.selectedPlayer.x = x;
          this.selectedPlayer.y = y;
        }
        break;
    }

    // Son konumu güncelle
    this.lastX = x;
    this.lastY = y;
  }


  // Finish drawing when mouse button or finger is released
  private endDrawing(x: number, y: number): void {
    if (!this.drawing) return;

    switch (this.drawingMode) {
      case 'pen':
        // Finish the pen line and save it
        if (this.currentPath.length > 1) {
          const newPenLine: PenLine = {
            id: this.nextPenLineId++,
            points: [...this.currentPath],
            color: this.currentColor,
            width: this.currentLineWidth
          };

          this.penLines.push(newPenLine);
          this.saveState();
        }
        this.currentPath = [];
        break;

      case 'arrow':
        // Finish the arrow and save it
        if (this.isCreatingArrow && this.tempArrow) {
          // Only create arrow if it has some minimum length
          const dx = this.tempArrow.endX - this.tempArrow.startX;
          const dy = this.tempArrow.endY - this.tempArrow.startY;
          const length = Math.sqrt(dx * dx + dy * dy);

          if (length > 10) {
            const newArrow: Arrow = {
              id: this.nextArrowId++,
              startX: this.tempArrow.startX,
              startY: this.tempArrow.startY,
              endX: this.tempArrow.endX,
              endY: this.tempArrow.endY,
              color: this.currentColor,
              width: this.currentLineWidth
            };

            this.arrows.push(newArrow);
            this.saveState();
          }
        }

        this.isCreatingArrow = false;
        this.tempArrow = null;
        break;

      case 'circle':
        // Finish the circle and save it
        if (this.isCreatingCircle && this.tempCircle) {
          // Only create circle if it has some minimum radius
          if (this.tempCircle.radius > 5) {
            const newCircle: Circle = {
              id: this.nextCircleId++,
              x: this.tempCircle.x,
              y: this.tempCircle.y,
              radius: this.tempCircle.radius,
              color: this.currentColor,
              width: this.currentLineWidth
            };

            this.circles.push(newCircle);
            this.saveState();
          }
        }

        this.isCreatingCircle = false;
        this.tempCircle = null;
        break;

      case 'player':
        // End player dragging
        if (this.selectedPlayer) {
          this.selectedPlayer.dragging = false;
          this.saveState();
        }
        break;
    }

    this.drawing = false;
    this.redrawCanvas();
  }

  // Helper method for eraser mode
  private checkForErasure(x: number, y: number): void {
    // Check for players to erase
    for (let i = this.players.length - 1; i >= 0; i--) {
      const player = this.players[i];
      const dx = player.x - x;
      const dy = player.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= 15) { // Player radius
        this.players.splice(i, 1);
        if (this.selectedPlayer === player) {
          this.selectedPlayer = null;
        }
        this.saveState();
        return;
      }
    }

    // Check for arrows to erase
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const arrow = this.arrows[i];

      // Check if point is near the arrow line
      const dist = this.pointToLineDistance(
        x, y,
        arrow.startX, arrow.startY,
        arrow.endX, arrow.endY
      );

      if (dist <= 10) {
        this.arrows.splice(i, 1);
        this.saveState();
        return;
      }
    }

    // Check for circles to erase
    for (let i = this.circles.length - 1; i >= 0; i--) {
      const circle = this.circles[i];
      const dx = circle.x - x;
      const dy = circle.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if point is near the circle perimeter
      if (Math.abs(distance - circle.radius) <= 10) {
        this.circles.splice(i, 1);
        this.saveState();
        return;
      }
    }

    // Check for pen lines to erase
    for (let i = this.penLines.length - 1; i >= 0; i--) {
      const line = this.penLines[i];

      // Check each segment of the pen line
      for (let j = 1; j < line.points.length; j++) {
        const p1 = line.points[j - 1];
        const p2 = line.points[j];

        const dist = this.pointToLineDistance(
          x, y,
          p1.x, p1.y,
          p2.x, p2.y
        );

        if (dist <= 10) {
          this.penLines.splice(i, 1);
          this.saveState();
          return;
        }
      }
    }
  }

  // Helper method to calculate distance from a point to a line segment
  private pointToLineDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;

    // Handle zero-length line segments
    if (len_sq === 0) return Math.sqrt(A * A + B * B);

    let param = dot / len_sq;

    // Find nearest point on line segment
    if (param < 0) param = 0;
    else if (param > 1) param = 1;

    const xx = x1 + param * C;
    const yy = y1 + param * D;

    const dx = x - xx;
    const dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  // Fare ve dokunmatik olayları

  private handleMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if (!this.canvasRect) return;

    const { x, y } = this.getCanvasCoordinates(event.clientX, event.clientY);
    this.startDrawing(x, y);
  }

  private handleMouseMove(event: MouseEvent): void {
    event.preventDefault();
    if (!this.canvasRect) return;

    const { x, y } = this.getCanvasCoordinates(event.clientX, event.clientY);
    this.continueDrawing(x, y);
  }

  private handleMouseUp(event: MouseEvent): void {
    event.preventDefault();
    if (!this.canvasRect) return;

    const { x, y } = this.getCanvasCoordinates(event.clientX, event.clientY);
    this.endDrawing(x, y);
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    if (!this.canvasRect || event.touches.length === 0) return;

    const touch = event.touches[0];
    const { x, y } = this.getCanvasCoordinates(touch.clientX, touch.clientY);
    this.startDrawing(x, y);
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (!this.canvasRect || event.touches.length === 0) return;

    const touch = event.touches[0];
    const { x, y } = this.getCanvasCoordinates(touch.clientX, touch.clientY);
    this.continueDrawing(x, y);
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    if (!this.canvasRect) return;

    const { x, y } = this.getCanvasCoordinates(this.lastX, this.lastY);
    this.endDrawing(x, y);
  }

  private getCanvasCoordinates(clientX: number, clientY: number): { x: number, y: number } {
    if (!this.canvasRect) {
      this.updateCanvasRect();
    }

    return {
      x: clientX - (this.canvasRect?.left || 0),
      y: clientY - (this.canvasRect?.top || 0)
    };
  }
  // Diziliş şablonlarını uygulama
  loadFormation(formation: string): void {
    // Önce sahayı temizle
    this.clear();

    const fieldWidth = this.canvasRef.nativeElement.width;
    const fieldHeight = this.canvasRef.nativeElement.height;
    const centerX = fieldWidth / 2;
    const centerY = fieldHeight / 2;

    // Kaleci her dizilişte aynı
    this.players.push({
      id: this.nextPlayerId++,
      x: 70, // Sol taraftaki kale önü
      y: centerY,
      team: 'home',
      number: 1,
      name: 'Kaleci',
      dragging: false,
      color: this.homeTeamColor
    });

    // Seçilen dizilişe göre oyuncuları yerleştir
    switch (formation) {
      case '4-4-2':
        // 4 defans
        this.addDefenseLine(4, centerY, 150);

        // 4 orta saha
        this.addMidfieldLine(4, centerY, 300);

        // 2 forvet
        this.addForwardLine(2, centerY, 450);
        break;

      case '4-3-3':
        // 4 defans
        this.addDefenseLine(4, centerY, 150);

        // 3 orta saha
        this.addMidfieldLine(3, centerY, 300);

        // 3 forvet
        this.addForwardLine(3, centerY, 450);
        break;

      case '3-5-2':
        // 3 defans
        this.addDefenseLine(3, centerY, 150);

        // 5 orta saha
        this.addMidfieldLine(5, centerY, 300);

        // 2 forvet
        this.addForwardLine(2, centerY, 450);
        break;

      case '5-3-2':
        // 5 defans
        this.addDefenseLine(5, centerY, 150);

        // 3 orta saha
        this.addMidfieldLine(3, centerY, 300);

        // 2 forvet
        this.addForwardLine(2, centerY, 450);
        break;
    }

    this.redrawCanvas();
    this.saveState();
  }

  // Oyuncu hatları oluşturma yardımcı metodlar
  private addDefenseLine(count: number, centerY: number, xPos: number): void {
    const spacing = 100;
    const startY = centerY - (spacing * (count - 1)) / 2;

    for (let i = 0; i < count; i++) {
      this.players.push({
        id: this.nextPlayerId++,
        x: xPos,
        y: startY + i * spacing,
        team: 'home',
        number: i + 2, // 2'den başla (kaleci 1)
        name: '',
        dragging: false,
        color: this.homeTeamColor
      });
    }
  }

  private addMidfieldLine(count: number, centerY: number, xPos: number): void {
    const spacing = 100;
    const startY = centerY - (spacing * (count - 1)) / 2;
    const startNumber = 2 + 5; // Defans oyuncularından sonra

    for (let i = 0; i < count; i++) {
      this.players.push({
        id: this.nextPlayerId++,
        x: xPos,
        y: startY + i * spacing,
        team: 'home',
        number: startNumber + i,
        name: '',
        dragging: false,
        color: this.homeTeamColor
      });
    }
  }

  private addForwardLine(count: number, centerY: number, xPos: number): void {
    const spacing = 100;
    const startY = centerY - (spacing * (count - 1)) / 2;
    const startNumber = 2 + 5 + 5; // Defans ve orta saha oyuncularından sonra

    for (let i = 0; i < count; i++) {
      this.players.push({
        id: this.nextPlayerId++,
        x: xPos,
        y: startY + i * spacing,
        team: 'home',
        number: startNumber + i,
        name: '',
        dragging: false,
        color: this.homeTeamColor
      });
    }
  }


  private updateCanvasRect(): void {
    if (isPlatformBrowser(this.platformId)) {
      const canvas = this.canvasRef.nativeElement;
      const bgCanvas = this.backgroundCanvasRef.nativeElement;
      const container = canvas.parentElement;

      if (!container) return;

      // Responsive canvas boyutlandırma
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Canvas boyutlarını ayarla
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      bgCanvas.width = containerWidth;
      bgCanvas.height = containerHeight;

      // Ölçeklendirme faktörünü hesapla
      const scaleX = containerWidth / this.fieldWidth;
      const scaleY = containerHeight / this.fieldHeight;

      // Arka plan sahayı yeniden çiz
      this.drawBackgroundField();

      // Canvas dikdörtgenini güncelle
      this.canvasRect = canvas.getBoundingClientRect();

      // Mevcut elemanları yeniden çiz
      this.redrawCanvas();
    }
  }

 @HostListener('window:resize', ['$event'])
onResize(): void {
  // Canvas boyutunu ve konumunu güncelle
  this.updateCanvasRect();
}

  // Undo/Redo methods
  undo(): void {
    if (this.undoStack.length <= 1) return;

    // Save current state to redo stack
    const currentState = this.undoStack.pop()!;
    this.redoStack.push(currentState);

    // Load previous state
    const previousState = this.undoStack[this.undoStack.length - 1];
    this.loadState(previousState);
  }

  redo(): void {
    if (this.redoStack.length === 0) return;

    // Get state from redo stack
    const nextState = this.redoStack.pop()!;
    this.undoStack.push(nextState);

    // Load the state
    this.loadState(nextState);
  }

  // Load a saved tactic
  loadTactic(tactic: TacticState | null): void {
    if (!tactic) return;

    this.players = [...tactic.players];
    this.arrows = [...tactic.arrows];
    this.circles = [...tactic.circles];
    this.penLines = [...(tactic.penLines || [])];

    // Reset IDs
    this.nextPlayerId = Math.max(...this.players.map(p => p.id), 0) + 1;
    this.nextArrowId = Math.max(...this.arrows.map(a => a.id), 0) + 1;
    this.nextCircleId = Math.max(...this.circles.map(c => c.id), 0) + 1;
    this.nextPenLineId = Math.max(...(this.penLines.map(p => p.id) || [0]), 0) + 1;

    this.redrawCanvas();
    this.saveState();

    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Taktik yüklendi: ' + tactic.name
    });
  }

  // Taktik silme metodunu da aynı şekilde güncelleyebilirsiniz
  deleteTactic(tactic: TacticState | null): void {
    if (!tactic) return;

    const index = this.savedTactics.findIndex(t => t.name === tactic.name);
    if (index !== -1) {
      this.savedTactics.splice(index, 1);
      this.saveTacticsToStorage();

      this.messageService.add({
        severity: 'success',
        summary: 'Başarılı',
        detail: 'Taktik silindi: ' + tactic.name
      });
    }
  }

  // Export the current tactic as an image
  exportAsImage(): void {
    const canvas = this.canvasRef.nativeElement;
    const bgCanvas = this.backgroundCanvasRef.nativeElement;

    // Create a new canvas to combine background and foreground
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d')!;

    // Draw background
    exportCtx.drawImage(bgCanvas, 0, 0);

    // Draw foreground
    exportCtx.drawImage(canvas, 0, 0);

    // Create download link
    const link = document.createElement('a');
    link.download = 'futbol-taktik.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }

  // Toggle player team
  togglePlayerTeam(): void {
    if (!this.selectedPlayer) return;

    this.selectedPlayer.team = this.selectedPlayer.team === 'home' ? 'away' : 'home';
    this.selectedPlayer.color = this.selectedPlayer.team === 'home' ? this.homeTeamColor : this.awayTeamColor;

    this.redrawCanvas();
    this.saveState();
  }

  // Update player number
  updatePlayerNumber(number: number): void {
    if (!this.selectedPlayer) return;

    this.selectedPlayer.number = number;
    this.redrawCanvas();
    this.saveState();
  }

  // Update player name
  updatePlayerName(name: string): void {
    if (!this.selectedPlayer) return;

    this.selectedPlayer.name = name;
    this.redrawCanvas();
    this.saveState();
  }

  // Duplicate player
  duplicatePlayer(): void {
    if (!this.selectedPlayer) return;

    const newPlayer: Player = {
      ...this.selectedPlayer,
      id: this.nextPlayerId++,
      x: this.selectedPlayer.x + 30,
      y: this.selectedPlayer.y + 30,
      dragging: false
    };

    this.players.push(newPlayer);
    this.selectedPlayer = newPlayer;

    this.redrawCanvas();
    this.saveState();
  }

  // Delete player
  deletePlayer(): void {
    if (!this.selectedPlayer) return;

    const index = this.players.findIndex(p => p === this.selectedPlayer);
    if (index !== -1) {
      this.players.splice(index, 1);
      this.selectedPlayer = null;

      this.redrawCanvas();
      this.saveState();
    }
  }
}
