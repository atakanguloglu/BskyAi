import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { KadroOnerisiComponent } from './pages/kadro-onerisi/kadro-onerisi.component';
import { IstatistikComponent } from './pages/istatistik/istatistik.component';
import { RakipAnaliziComponent } from './pages/rakip-analizi/rakip-analizi.component';
import { DizilisOnerisiComponent } from './pages/dizilis-onerisi/dizilis-onerisi.component';
import { PersonelKadroComponent } from './pages/personel-kadro/personel-kadro.component';
import { FutbolcuOnerileriComponent } from './pages/futbolcu-onerileri/futbolcu-onerileri.component';
import { AntrenmanYonetimiComponent } from './pages/antrenman-yonetimi/antrenman-yonetimi.component';
import { TaktikTahtasiComponent } from './pages/taktik-tahtasi/taktik-tahtasi.component';
import { GozlemciRaporlariComponent } from './pages/gozlemci-raporlari/gozlemci-raporlari.component';
import { MatchPredictionComponent } from './pages/match-prediction/match-prediction.component';
import { TeamChemistryComponent } from './pages/team-chemistry/team-chemistry.component';
import { HealthFormComponent } from './pages/health-form/health-form.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { SettingsComponent } from './pages/settings/settings.component';


export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'kadro-onerisi', component: KadroOnerisiComponent },
      { path: 'istatistik', component: IstatistikComponent },
      { path: 'rakip-analizi', component: RakipAnaliziComponent },
      { path: 'dizilis-onerisi', component: DizilisOnerisiComponent },
      { path: 'personel-kadro', component: PersonelKadroComponent },
      { path: 'futbolcu-onerileri', component: FutbolcuOnerileriComponent },
      { path: 'antrenman-yonetimi', component: AntrenmanYonetimiComponent },
      { path: 'taktik-tahtasi', component: TaktikTahtasiComponent },
      { path: 'gozlemci-raporlari', component: GozlemciRaporlariComponent },
      { path: 'match-prediction', component: MatchPredictionComponent },
      { path: 'team-chemistry', component: TeamChemistryComponent },
      { path: 'health-form', component: HealthFormComponent },
      { path: 'chatbot', component: ChatbotComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
