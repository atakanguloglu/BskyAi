import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChipModule } from 'primeng/chip';
import { SliderModule } from 'primeng/slider';
import { MessageService, ConfirmationService } from 'primeng/api';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    CheckboxModule,
    CardModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    DividerModule,
    InputSwitchModule,
    ChipModule,
    SliderModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SettingsComponent implements OnInit {
  // Mevcut özelliklerinizi koruyun
  club = this.createClubModel();
  defaultPreferences = this.createDefaultPreferences();
  uiSettings = this.createUISettings();
  notifications = this.createNotifications();
  backups = this.createBackups();
  permissions = this.createPermissions();
  advanced = this.createAdvanced();
  modules = this.createModules();
  beta = this.createBeta();
  feedback = this.createFeedback();

  // Şablonda kullanılan yeni özellikler
  isSaving: boolean = false;
  hasUnsavedChanges: boolean = false;
  originalState: any = {};
  aiPriority: number = 5;
  predictionAccuracy: number = 7;
  tacticBoardEnabled: boolean = true;
  rating: number = 0;

  // Aynı seçenekleri koruyun
  formationOptions = ['4-2-3-1', '4-3-3', '3-5-2', '4-4-2', '3-4-3'];
  homepageOptions = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Oyuncu Önerileri', value: 'suggestions' },
    { label: 'İstatistikler', value: 'statistics' },
    { label: 'Rakip Analizi', value: 'opponent-analysis' }
  ];
  languageOptions = ['Türkçe', 'İngilizce', 'Fransızca', 'İspanyolca', 'Almanca'];
  fontSizeOptions = ['small', 'medium', 'large'];
  themeColors = ['blue', 'green', 'red', 'purple', 'orange'];
  exportFormats = ['JSON', 'CSV', 'PDF'];
  backupFrequencies = ['daily', 'weekly', 'monthly'];
  activeTab: string = 'club';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    // Orijinal durumu kaydet (değişiklikler olup olmadığını izlemek için)
    this.saveOriginalState();
  }

  saveOriginalState() {
    this.originalState = {
      club: { ...this.club },
      defaultPreferences: { ...this.defaultPreferences },
      notifications: { ...this.notifications },
      backups: { ...this.backups },
      permissions: [...this.permissions],
      advanced: { ...this.advanced },
      modules: { ...this.modules },
      beta: { ...this.beta },
      feedback: { ...this.feedback }
    };
  }

  checkChanges() {
    // Değişiklik olup olmadığını kontrol et
    this.hasUnsavedChanges = JSON.stringify(this.originalState) !== JSON.stringify({
      club: { ...this.club },
      defaultPreferences: { ...this.defaultPreferences },
      notifications: { ...this.notifications },
      backups: { ...this.backups },
      permissions: [...this.permissions],
      advanced: { ...this.advanced },
      modules: { ...this.modules },
      beta: { ...this.beta },
      feedback: { ...this.feedback }
    });
  }

  saveSettings() {
    this.confirmationService.confirm({
      message: 'Tüm değişiklikleri kaydetmek istediğinize emin misiniz?',
      header: 'Değişiklikleri Kaydet',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.isSaving = true;

        // Backend bağlantısı gelecekte burada olacak
        setTimeout(() => {
          console.log('Kaydedilen ayarlar:', {
            club: this.club,
            preferences: this.defaultPreferences,
            ui: this.uiSettings,
            notifications: this.notifications,
            backups: this.backups,
            permissions: this.permissions,
            advanced: this.advanced,
            modules: this.modules,
            beta: this.beta,
            feedback: this.feedback
          });

          this.isSaving = false;
          this.hasUnsavedChanges = false;
          this.saveOriginalState();

          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Tüm ayarlar başarıyla kaydedildi'
          });
        }, 800);
      }
    });
  }

  resetSettings() {
    this.confirmationService.confirm({
      message: 'Tüm değişiklikleri geri almak istediğinize emin misiniz?',
      header: 'Değişiklikleri Geri Al',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Orijinal halini geri yükle
        this.club = { ...this.originalState.club };
        this.defaultPreferences = { ...this.originalState.defaultPreferences };
        this.notifications = { ...this.originalState.notifications };
        this.backups = { ...this.originalState.backups };
        this.permissions = [...this.originalState.permissions];
        this.advanced = { ...this.originalState.advanced };
        this.modules = { ...this.originalState.modules };
        this.beta = { ...this.originalState.beta };
        this.feedback = { ...this.originalState.feedback };

        this.hasUnsavedChanges = false;

        this.messageService.add({
          severity: 'info',
          summary: 'Geri Alındı',
          detail: 'Değişiklikler geri alındı'
        });
      }
    });
  }

  // Mevcut model oluşturma fonksiyonlarınızı koruyun
  private createClubModel() {
    return {
      name: '',
      founded: null,
      country: '',
      city: '',
      stadium: '',
      colors: '',
      logoUrl: '',
      about: '',
    };
  }

  private createDefaultPreferences() {
    return {
      defaultFormation: '4-2-3-1',
      homepage: 'dashboard',
      defaultLanguage: 'Türkçe',
      showHints: true,
      autoSave: false
    };
  }

  private createUISettings() {
    return {
      darkMode: false,
      themeColor: 'blue',
      fontSize: 'medium'
    };
  }

  private createNotifications() {
    return {
      newSuggestions: true,
      weeklySummaryEmail: true,
      matchDayReminders: true
    };
  }

  private createBackups() {
    return {
      exportFormat: 'JSON',
      autoBackupEnabled: true,
      autoBackupFrequency: 'weekly'
    };
  }

  private createPermissions() {
    return [
      { role: 'Admin', canEdit: true },
      { role: 'Gözlemci', canEdit: false },
      { role: 'Analist', canEdit: false }
    ];
  }

  private createAdvanced() {
    return {
      enableLogs: true,
      developerMode: false
    };
  }

  private createModules() {
    return {
      chatbot: true,
      matchAnalysis: true,
      healthTracking: false
    };
  }

  private createBeta() {
    return {
      enableExperimentalFeatures: true,
      autoFormationAI: false,
      chemistryPrediction: true
    };
  }

  private createFeedback() {
    return {
      message: '',
      email: ''
    };
  }
}
