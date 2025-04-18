import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SliderModule } from 'primeng/slider';

interface Player {
  id: number;
  name: string;
  position: string;
  healthStatus: 'Fit' | 'Yaralı' | 'İyileşiyor' | 'Hafif Yaralı';
  lastTrainingStatus: string;
  fitnessLevel: number;
  injuries: Injury[];
  treatments: Treatment[];
  medicalHistory: MedicalRecord[];
  fitnessHistory: FitnessData[];
}

interface Injury {
  id: number;
  type: string;
  startDate: Date;
  estimatedRecovery: Date;
  actualRecovery?: Date;
  recoveryStatus: number;
  location: string;
  severity: 'Hafif' | 'Orta' | 'Ciddi';
  doctorNotes: string;
}

interface Treatment {
  id: number;
  name: string;
  details: string;
  startDate: Date;
  endDate?: Date;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  responsibleDoctor: string;
  recommendedByDoctor: string;
}

interface MedicalRecord {
  id: number;
  date: Date;
  type: string;
  description: string;
  doctor: string;
  attachments?: string[];
}

interface FitnessData {
  date: Date;
  level: number;
  note?: string;
}

@Component({
  selector: 'app-health-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    AvatarModule,
    ToastModule,
    TabViewModule,
    ChartModule,
    ProgressBarModule,
    TimelineModule,
    ChipModule,
    TagModule,
    CalendarModule,
    MultiSelectModule,
    DialogModule,
    DividerModule,
    SliderModule
  ],
  providers: [MessageService],
  templateUrl: './health-form.component.html',
  styleUrls: ['./health-form.component.scss']
})
export class HealthFormComponent implements OnInit {
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  healthStatusOptions = ['Fit', 'Yaralı', 'İyileşiyor', 'Hafif Yaralı'];
  injuryTypes = ['Kas Zorlanması', 'Bağ Zorlanması', 'Kırık', 'Burkulma', 'Ezilme', 'Kesik', 'Sıyrık'];
  bodyLocations = ['Sağ Ayak', 'Sol Ayak', 'Sağ Bacak', 'Sol Bacak', 'Sağ Kol', 'Sol Kol', 'Baş', 'Gövde', 'Sırt', 'Kalça'];
  severityLevels = ['Hafif', 'Orta', 'Ciddi'];
  treatmentOptions = ['Fizik Tedavi', 'Egzersiz Programı', 'İlaç Tedavisi', 'Cerrahi Operasyon', 'Bantlama', 'Masaj', 'Dinlenme'];

  // Initialize with default empty objects to prevent null errors
  currentInjury: Injury = this.createEmptyInjury();
  currentTreatment: Treatment = this.createEmptyTreatment();
  currentMedicalRecord: MedicalRecord = this.createEmptyMedicalRecord();

  showInjuryModal = false;
  showTreatmentModal = false;
  showMedicalRecordModal = false;

  fitnessChartData: any;
  fitnessChartOptions: any;

  recoveryTrend: any;
  recoveryTrendOptions: any;

  constructor(private messageService: MessageService) { }

  // Helper methods to create empty objects with default values
  createEmptyInjury(): Injury {
    return {
      id: 0,
      type: '',
      startDate: new Date(),
      estimatedRecovery: new Date(),
      recoveryStatus: 0,
      location: '',
      severity: 'Hafif',
      doctorNotes: ''
    };
  }

  createEmptyTreatment(): Treatment {
    return {
      id: 0,
      name: '',
      details: '',
      startDate: new Date(),
      status: 'Planned',
      responsibleDoctor: '',
      recommendedByDoctor: ''
    };
  }

  createEmptyMedicalRecord(): MedicalRecord {
    return {
      id: 0,
      date: new Date(),
      type: '',
      description: '',
      doctor: ''
    };
  }

  // Helpers for active injuries/treatments
  getActiveInjuriesCount(player: Player): number {
    return player.injuries.filter(i => !i.actualRecovery).length;
  }

  hasActiveInjuriesForPlayer(player: Player): boolean {
    return player.injuries.some(i => !i.actualRecovery);
  }

  ngOnInit() {
    this.loadPlayers();
    this.initCharts();
  }

  loadPlayers() {
    // Sample data - in a real app, fetch from an API
    this.players = [
      {
       
        id: 1,
        name: 'Ahmet Yılmaz',
        position: 'Forward',
        healthStatus: 'Fit',
        lastTrainingStatus: 'Completed',
        fitnessLevel: 92,
        injuries: [
          {
            id: 1,
            type: 'Kas Zorlanması',
            startDate: new Date('2024-01-15'),
            estimatedRecovery: new Date('2024-02-01'),
            actualRecovery: new Date('2024-02-03'),
            recoveryStatus: 100,
            location: 'Sol Bacak',
            severity: 'Orta',
            doctorNotes: 'Tamamen iyileşti, önümüzdeki maçlarda oynayabilir.'
          }
        ],
        treatments: [
          {
            id: 1,
            name: 'Fizik Tedavi',
            details: 'Haftada 3 gün, 45 dakikalık seanslar',
            startDate: new Date('2024-01-16'),
            endDate: new Date('2024-02-01'),
            status: 'Completed',
            responsibleDoctor: 'Dr. Mehmet Öz',
            recommendedByDoctor: 'Dr. Mehmet Öz'
          }
        ],
        medicalHistory: [
          {
            id: 1,
            date: new Date('2024-01-15'),
            type: 'Muayene',
            description: 'Kas zorlanması teşhisi konuldu',
            doctor: 'Dr. Mehmet Öz'
          },
          {
            id: 2,
            date: new Date('2024-02-03'),
            type: 'Kontrol',
            description: 'Tamamen iyileşti, antrenmanlara başlayabilir',
            doctor: 'Dr. Mehmet Öz'
          }
        ],
        fitnessHistory: [
          { date: new Date('2024-01-01'), level: 95 },
          { date: new Date('2024-01-15'), level: 65 },
          { date: new Date('2024-01-22'), level: 72 },
          { date: new Date('2024-01-29'), level: 81 },
          { date: new Date('2024-02-05'), level: 88 },
          { date: new Date('2024-02-12'), level: 92 }
        ]
      },
      {
        id: 2,
        name: 'Mehmet Demir',
        position: 'Midfielder',
        healthStatus: 'Yaralı', 
        lastTrainingStatus: 'Missed',
        fitnessLevel: 45,
        injuries: [
          {
            id: 2,
            type: 'Bağ Zorlanması',
            startDate: new Date('2024-02-10'),
            estimatedRecovery: new Date('2024-03-15'),
            recoveryStatus: 35,
            location: 'Sağ Ayak',
            severity: 'Ciddi',
            doctorNotes: 'İyileşme süreci devam ediyor, henüz antrenmana başlamamalı.'
          }
        ],
        treatments: [
          {
            id: 2,
            name: 'Fizik Tedavi',
            details: 'Haftada 5 gün, 60 dakikalık seanslar',
            startDate: new Date('2024-02-12'),
            status: 'In Progress',
            responsibleDoctor: 'Dr. Ayşe Kaya',
            recommendedByDoctor: 'Dr. Ayşe Kaya'
          }
        ],
        medicalHistory: [
          {
            id: 3,
            date: new Date('2024-02-10'),
            type: 'Acil Muayene',
            description: 'Maç sırasında bağ zorlanması',
            doctor: 'Dr. Ayşe Kaya'
          }
        ],
        fitnessHistory: [
          { date: new Date('2024-02-01'), level: 90 },
          { date: new Date('2024-02-10'), level: 40 },
          { date: new Date('2024-02-17'), level: 42 },
          { date: new Date('2024-02-24'), level: 45 }
        ]
      },
      {
        id: 3,
        name: 'Can Kaya',
        position: 'Defender',
        healthStatus: 'İyileşiyor', 
        lastTrainingStatus: 'Light Training',
        fitnessLevel: 75,
        injuries: [
          {
            id: 3,
            type: 'Burkulma',
            startDate: new Date('2024-01-25'),
            estimatedRecovery: new Date('2024-02-20'),
            recoveryStatus: 80,
            location: 'Sol Ayak',
            severity: 'Orta',
            doctorNotes: 'İyileşme süreci olumlu, hafif antrenman yapabilir.'
          }
        ],
        treatments: [
          {
            id: 3,
            name: 'İlaç Tedavisi',
            details: 'Anti-enflamatuar ilaçlar',
            startDate: new Date('2024-01-26'),
            status: 'In Progress',
            responsibleDoctor: 'Dr. Ali Yıldız',
            recommendedByDoctor: 'Dr. Ali Yıldız'
          },
          {
            id: 4,
            name: 'Bantlama',
            details: 'Antrenman ve maçlar öncesi',
            startDate: new Date('2024-02-10'),
            status: 'In Progress',
            responsibleDoctor: 'Dr. Ali Yıldız',
            recommendedByDoctor: 'Dr. Ali Yıldız'
          }
        ],
        medicalHistory: [
          {
            id: 4,
            date: new Date('2024-01-25'),
            type: 'Muayene',
            description: 'Antrenman sırasında ayak burkulması',
            doctor: 'Dr. Ali Yıldız'
          },
          {
            id: 5,
            date: new Date('2024-02-10'),
            type: 'Kontrol',
            description: 'İyileşme süreci devam ediyor, hafif antrenman önerildi',
            doctor: 'Dr. Ali Yıldız'
          }
        ],
        fitnessHistory: [
          { date: new Date('2024-01-15'), level: 90 },
          { date: new Date('2024-01-25'), level: 50 },
          { date: new Date('2024-02-01'), level: 58 },
          { date: new Date('2024-02-08'), level: 65 },
          { date: new Date('2024-02-15'), level: 72 },
          { date: new Date('2024-02-22'), level: 75 }
        ]
      }
    ];
  }

  initCharts() {
    this.initFitnessChartOptions();
    this.initRecoveryTrendOptions();
  }

  initFitnessChartOptions() {
    this.fitnessChartOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#6C757D'
          },
          grid: {
            display: false
          }
        },
        y: {
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            color: '#6C757D'
          },
          grid: {
            color: '#E9ECEF'
          }
        }
      }
    };
  }

  initRecoveryTrendOptions() {
    this.recoveryTrendOptions = {
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#6C757D'
          },
          grid: {
            display: false
          }
        },
        y: {
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            color: '#6C757D'
          },
          grid: {
            color: '#E9ECEF'
          }
        }
      }
    };
  }

  selectPlayer(player: Player) {
    this.selectedPlayer = player;
    this.updateFitnessChart();
    this.updateRecoveryTrend();
  }

  updateFitnessChart() {
    if (!this.selectedPlayer) return;

    const data = this.selectedPlayer.fitnessHistory;
    const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());

    this.fitnessChartData = {
      labels: sortedData.map(item => this.formatDate(item.date)),
      datasets: [
        {
          label: 'Fitness Seviyesi',
          data: sortedData.map(item => item.level),
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3B82F6',
          tension: 0.4
        }
      ]
    };
  }

  updateRecoveryTrend() {
    if (!this.selectedPlayer) return;

    // Mevcut grafiği temizle
    this.recoveryTrend = null;

    const activeInjuries = this.selectedPlayer.injuries.filter(
      injury => !injury.actualRecovery
    );

    if (activeInjuries.length === 0) return;

    // Her yaralanma için sadece bir grafik göster (çakışmayı önle)
    const currentInjury = activeInjuries[0]; // En son yaralanmayı göster

    // Yaralanma başlangıcından tahmini iyileşmeye kadar olan süreyi hesapla
    const start = currentInjury.startDate.getTime();
    const end = currentInjury.estimatedRecovery.getTime();
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Günlük beklenen iyileşme oranı
    const dailyRate = 100 / totalDays;

    // Bugüne kadar geçen gün sayısı
    const today = new Date();
    const daysPassed = Math.ceil((today.getTime() - start) / (1000 * 60 * 60 * 24));

    // Beklenen değerler
    const expectedData = [];
    const actualData = [];
    const labels = [];

    // Gün gün verileri oluştur
    for (let day = 0; day <= totalDays; day++) {
      const date = new Date(start);
      date.setDate(date.getDate() + day);
      labels.push(this.formatDate(date));

      const expected = Math.min(Math.round(day * dailyRate), 100);
      expectedData.push(expected);

      // Gerçek veri için, bugüne kadar olan günler için gerçek recovery değeri
      if (day <= daysPassed) {
        const actual = day === daysPassed ? currentInjury.recoveryStatus : Math.round((currentInjury.recoveryStatus / daysPassed) * day);
        actualData.push(actual);
      } else {
        actualData.push(null);
      }
    }

    // Tek bir grafik oluştur
    this.recoveryTrend = {
      labels: labels,
      datasets: [
        {
          label: 'Beklenen İyileşme',
          data: expectedData,
          borderColor: '#64B5F6',
          backgroundColor: 'rgba(100, 181, 246, 0.2)',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        },
        {
          label: 'Gerçek İyileşme',
          data: actualData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: false,
          tension: 0.4
        }
      ]
    };
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit' }).format(date);
  }

  getHealthStatusClass(status: string): "success" | "danger" | "warning" | "info" | "secondary" {
    switch (status) {
      case 'Fit': return 'success';
      case 'Injured': return 'danger';
      case 'Recovering': return 'warning';
      case 'Light Injured': return 'info';
      default: return 'secondary';
    }
  }

  getTreatmentStatusClass(status: string): "success" | "info" | "warning" | "danger" | "secondary" {
    switch (status) {
      case 'Tamamlandı': return 'success';  // 'Completed' yerine
      case 'Devam Ediyor': return 'info';   // 'In Progress' yerine
      case 'Planlandı': return 'warning';   // 'Planned' yerine
      case 'İptal Edildi': return 'danger'; // 'Cancelled' yerine
      default: return 'secondary';
    }
  }

  getSeverityClass(severity: string): "success" | "warning" | "danger" | "secondary" {
    switch (severity) {
      case 'Hafif': return 'success';
      case 'Orta': return 'warning';
      case 'Ciddi': return 'danger';
      default: return 'secondary';
    }
  }

  addNewInjury() {
    if (!this.selectedPlayer) return;

    this.currentInjury = this.createEmptyInjury();
    this.showInjuryModal = true;
  }

  saveInjury() {
    if (!this.selectedPlayer) return;

    if (this.currentInjury.id === 0) {
      // Yeni kayıt
      this.currentInjury.id = this.getNextInjuryId();
      this.selectedPlayer.injuries.push(this.currentInjury);
    } else {
      // Güncelleme
      const index = this.selectedPlayer.injuries.findIndex(i => i.id === this.currentInjury.id);
      if (index !== -1) {
        this.selectedPlayer.injuries[index] = this.currentInjury;
      }
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Sakatlık kaydı güncellendi.'
    });

    this.closeInjuryModal();
    this.updateRecoveryTrend();
  }

  editInjury(injury: Injury) {
    this.currentInjury = { ...injury };
    this.showInjuryModal = true;
  }

  closeInjuryModal() {
    this.showInjuryModal = false;
    this.currentInjury = this.createEmptyInjury();
  }

  addNewTreatment() {
    if (!this.selectedPlayer) return;

    this.currentTreatment = this.createEmptyTreatment();
    this.showTreatmentModal = true;
  }

  saveTreatment() {
    if (!this.selectedPlayer) return;

    if (this.currentTreatment.id === 0) {
      // Yeni kayıt
      this.currentTreatment.id = this.getNextTreatmentId();
      this.selectedPlayer.treatments.push(this.currentTreatment);
    } else {
      // Güncelleme
      const index = this.selectedPlayer.treatments.findIndex(t => t.id === this.currentTreatment.id);
      if (index !== -1) {
        this.selectedPlayer.treatments[index] = this.currentTreatment;
      }
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Tedavi kaydı güncellendi.'
    });

    this.closeTreatmentModal();
  }

  editTreatment(treatment: Treatment) {
    this.currentTreatment = { ...treatment };
    this.showTreatmentModal = true;
  }

  closeTreatmentModal() {
    this.showTreatmentModal = false;
    this.currentTreatment = this.createEmptyTreatment();
  }

  addNewMedicalRecord() {
    if (!this.selectedPlayer) return;

    this.currentMedicalRecord = this.createEmptyMedicalRecord();
    this.showMedicalRecordModal = true;
  }

  saveMedicalRecord() {
    if (!this.selectedPlayer) return;

    if (this.currentMedicalRecord.id === 0) {
      // Yeni kayıt
      this.currentMedicalRecord.id = this.getNextMedicalRecordId();
      this.selectedPlayer.medicalHistory.push(this.currentMedicalRecord);
    } else {
      // Güncelleme
      const index = this.selectedPlayer.medicalHistory.findIndex(m => m.id === this.currentMedicalRecord.id);
      if (index !== -1) {
        this.selectedPlayer.medicalHistory[index] = this.currentMedicalRecord;
      }
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Tıbbi kayıt güncellendi.'
    });

    this.closeMedicalRecordModal();
  }

  editMedicalRecord(record: MedicalRecord) {
    this.currentMedicalRecord = { ...record };
    this.showMedicalRecordModal = true;
  }

  closeMedicalRecordModal() {
    this.showMedicalRecordModal = false;
    this.currentMedicalRecord = this.createEmptyMedicalRecord();
  }

  getNextInjuryId(): number {
    if (!this.selectedPlayer) return 0;
    const maxId = Math.max(0, ...this.selectedPlayer.injuries.map(i => i.id));
    return maxId + 1;
  }

  getNextTreatmentId(): number {
    if (!this.selectedPlayer) return 0;
    const maxId = Math.max(0, ...this.selectedPlayer.treatments.map(t => t.id));
    return maxId + 1;
  }

  getNextMedicalRecordId(): number {
    if (!this.selectedPlayer) return 0;
    const maxId = Math.max(0, ...this.selectedPlayer.medicalHistory.map(m => m.id));
    return maxId + 1;
  }

  isRecoveryCompleted(injury: Injury): boolean {
    return injury.recoveryStatus >= 100 || !!injury.actualRecovery;
  }

  markAsRecovered(injury: Injury) {
    injury.recoveryStatus = 100;
    injury.actualRecovery = new Date();

    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Oyuncu iyileşti olarak işaretlendi.'
    });

    this.updateRecoveryTrend();
  }

  updateFitnessLevel() {
    if (!this.selectedPlayer) return;

    const today = new Date();
    const existingEntry = this.selectedPlayer.fitnessHistory.find(
      entry => this.isSameDay(entry.date, today)
    );

    if (existingEntry) {
      existingEntry.level = this.selectedPlayer.fitnessLevel;
    } else {
      this.selectedPlayer.fitnessHistory.push({
        date: today,
        level: this.selectedPlayer.fitnessLevel
      });
    }

    this.updateFitnessChart();

    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Fitness seviyesi güncellendi.'
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  // UI için yardımcı metodlar
  estimateRecoveryDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  calculateDaysRemaining(injury: Injury): number {
    if (injury.actualRecovery) return 0;

    const today = new Date();
    const estimated = new Date(injury.estimatedRecovery);
    const diff = estimated.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return Math.max(0, days);
  }

  getActiveInjuries(): Injury[] {
    if (!this.selectedPlayer) return [];
    return this.selectedPlayer.injuries.filter(i => !i.actualRecovery);
  }

  getActiveTreatments(): Treatment[] {
    if (!this.selectedPlayer) return [];
    return this.selectedPlayer.treatments.filter(t =>
      t.status === 'In Progress' || t.status === 'Planned'
    );
  }

  hasActiveInjuries(): boolean {
    return this.selectedPlayer ? this.selectedPlayer.injuries.some(i => !i.actualRecovery) : false;
  }

  hasActiveTreatments(): boolean {
    return this.selectedPlayer ? this.selectedPlayer.treatments.some(t => t.status === 'In Progress' || t.status === 'Planned') : false;
  }

  hasActiveInjury(player: Player): boolean {
    return player.injuries.some(i => !i.actualRecovery);
  }
}
