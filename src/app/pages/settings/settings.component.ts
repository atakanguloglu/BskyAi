import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
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
    TabViewModule,
    ButtonModule,
    CheckboxModule
  ],
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
export class SettingsComponent {
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

  saveSettings() {
    console.log('%c✔️ Ayarlar kaydedildi:', 'color: green; font-weight: bold;', {
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
  }
  activeTab: string = 'club';

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
