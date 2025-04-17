import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api'; // MenuItem'ı buradan import edin
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NewlineToBrPipe } from './newline-to-br.pipe';


interface ChatConversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
  unread?: boolean;
}

interface ChatMessage {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
  suggestions?: string[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CardModule,
    AvatarModule,
    TooltipModule,
    MenuModule,
    BadgeModule,
    ToastModule,
    DividerModule,
    ChipModule,
    SkeletonModule,
    ConfirmDialogModule,
    NewlineToBrPipe  
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer: ElementRef | undefined;
  @ViewChild('messageInput') messageInput: ElementRef | undefined;

  userInput = '';
  isLoading = false;
  menuItems: MenuItem[] = [];
  conversations: ChatConversation[] = [];
  activeConversation: ChatConversation | null = null;
  isMobileSidebarVisible = false;
  isFirstInteraction = true;

  // Kullanıcı sorgu önerileri
  suggestedQueries = [
    'Takım performansını analiz et',
    'Gelecek maç için öneri ver',
    'En uyumlu oyuncular kimler?',
    'Sakatlık durumlarını özetle',
    'Transfer önerileri listele'
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.initMenuItems();
    this.loadConversations();

    // Yeni bir konuşma yoksa, otomatik oluştur
    if (this.conversations.length === 0) {
      this.createNewConversation();
    } else {
      this.setActiveConversation(this.conversations[0].id);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private initMenuItems() {
    this.menuItems = [
      {
        label: 'Yeni Konuşma',
        icon: 'pi pi-plus',
        command: () => this.createNewConversation()
      },
      {
        label: 'Tüm Konuşmaları Sil',
        icon: 'pi pi-trash',
        command: () => this.confirmDeleteAllConversations()
      }
    ];
  }

  private loadConversations() {
    // Önceki konuşmaları yükle (LocalStorage veya API'den gelebilir)
    // Örnek konuşmalar
    this.conversations = [
      {
        id: '1',
        title: 'Taktik Analizi',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 gün önce
        messages: [
          {
            id: '1-1',
            from: 'user',
            text: 'Önümüzdeki maç için en iyi taktik ne olur?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
          },
          {
            id: '1-2',
            from: 'bot',
            text: 'Rakibin son 5 maçını analiz ettim. Özellikle sol kanatlardan yaptıkları hücumlarda etkili oluyorlar. 4-3-3 dizilişi ile sağ kanada ağırlık veren bir oyun planı uygulayabilirsiniz. Özellikle kanat oyuncularınızın hızlı olması avantaj sağlayabilir.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 30) // 30 saniye sonra
          }
        ]
      },
      {
        id: '2',
        title: 'Oyuncu Transferleri',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 gün önce
        messages: [
          {
            id: '2-1',
            from: 'user',
            text: 'Hangi pozisyonlara transfer yapmalıyız?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
          },
          {
            id: '2-2',
            from: 'bot',
            text: 'Takım analizine göre, sol bek ve orta saha pozisyonlarını güçlendirmeniz gerekiyor. Şu anda sol bek pozisyonunda sadece 1 oyuncunuz var ve yaş ortalaması yüksek. Orta sahada ise yaratıcı bir oyuncu eksiğiniz göze çarpıyor.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 45)
          }
        ],
        unread: true
      }
    ];
  }

  createNewConversation() {
    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      title: 'Yeni Konuşma',
      timestamp: new Date(),
      messages: []
    };

    this.conversations.unshift(newConversation);
    this.setActiveConversation(newConversation.id);

    // Yeni konuşmada bot karşılama mesajı
    this.addBotGreeting();

    this.messageService.add({
      severity: 'success',
      summary: 'Yeni Konuşma',
      detail: 'Yeni bir konuşma başlatıldı'
    });
  }

  setActiveConversation(conversationId: string) {
    const convo = this.conversations.find(c => c.id === conversationId);
    if (convo) {
      this.activeConversation = convo;

      // Okunmamış mesaj durumunu güncelle
      if (convo.unread) {
        convo.unread = false;
      }

      // Mobile görünümde yan paneli kapat
      this.isMobileSidebarVisible = false;

      // Input alanına odaklan
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  updateConversationTitle(conversation: ChatConversation) {
    // İlk kullanıcı mesajını başlık olarak kullan
    if (conversation.messages.length > 0) {
      const firstUserMsg = conversation.messages.find(m => m.from === 'user');
      if (firstUserMsg) {
        // Max 25 karakter uzunluğunda başlık
        conversation.title = firstUserMsg.text.length > 25
          ? firstUserMsg.text.substring(0, 25) + '...'
          : firstUserMsg.text;
      }
    }
  }

  sendMessage() {
    if (!this.userInput.trim() || !this.activeConversation) return;

    // Kullanıcı mesajı ekle
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: this.userInput,
      timestamp: new Date()
    };

    this.activeConversation.messages.push(userMessage);
    this.activeConversation.timestamp = new Date();

    // İlk etkileşimse başlık güncelle
    if (this.isFirstInteraction) {
      this.updateConversationTitle(this.activeConversation);
      this.isFirstInteraction = false;
    }

    const inputText = this.userInput;
    this.userInput = '';

    // Bot yanıtı için yükleniyor durumu
    this.isLoading = true;

    // Yükleniyor mesajı ekle
    const loadingMessage: ChatMessage = {
      id: 'loading-' + Date.now().toString(),
      from: 'bot',
      text: '',
      timestamp: new Date(),
      isLoading: true
    };

    this.activeConversation.messages.push(loadingMessage);

    // Gerçek bir API çağrısı yapacak olsaydık burada yapardık
    // Şimdilik sadece bir gecikme ve sabit yanıt ekliyoruz
    setTimeout(() => {
      // Yükleniyor mesajını kaldır
      this.activeConversation!.messages = this.activeConversation!.messages.filter(m => !m.isLoading);

      // Bot yanıtı
      const botResponse = this.generateBotResponse(inputText);
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        from: 'bot',
        text: botResponse.text,
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };

      this.activeConversation!.messages.push(botMessage);
      this.isLoading = false;
    }, 1500);
  }

  generateBotResponse(input: string): { text: string, suggestions?: string[] } {
    // Gerçek uygulamada burası API'ye istek atacak
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('analiz') || lowerInput.includes('performans')) {
      return {
        text: 'Takımın son 5 maçlık performans analizi:\n\n' +
          '- Galibiyet: 3\n' +
          '- Beraberlik: 1\n' +
          '- Mağlubiyet: 1\n\n' +
          'Topa sahip olma oranı: %62 (lig ortalamasının üzerinde)\n' +
          'Gol sayısı: 10 (maç başına 2 gol)\n' +
          'Pozisyon üretme: 14.3 (lig ortalamasının üzerinde)\n' +
          'Defansif performans: %75 (4 gol yendi)',
        suggestions: ['Hangi oyuncu en iyi performans gösterdi?', 'Taktik değişikliğine ihtiyaç var mı?', 'Kimya puanı nasıl?']
      };
    }
    else if (lowerInput.includes('maç') || lowerInput.includes('öneri')) {
      return {
        text: 'Önümüzdeki maç için önerilerim:\n\n' +
          '1. Rakip son maçlarda kanatlardan etkili olduğu için 3-5-2 dizilişi düşünülebilir.\n' +
          '2. Hızlı geçiş oyunuyla rakip savunmayı zorlamak etkili olabilir.\n' +
          '3. Set oyunlarında özellikle duran toplar büyük fırsat yaratabilir, rakibin burada zafiyeti var.\n' +
          '4. İlk 15 dakikada yüksek pres uygulanabilir, rakip geçen maçlarında başlangıçlarda zorlanmış.',
        suggestions: ['Muhtemel ilk 11 nedir?', 'Hangi oyuncular öne çıkabilir?', 'Rakibin zayıf yönleri nelerdir?']
      };
    }
    else if (lowerInput.includes('oyuncu') || lowerInput.includes('uyum') || lowerInput.includes('kimya')) {
      return {
        text: 'Takım içi en yüksek uyuma sahip oyuncular:\n\n' +
          '1. Ahmet Yılmaz - Mehmet Demir (Merkez ikili - %92 uyum)\n' +
          '2. Kerem Aktürkoğlu - Can Kaya (Sol kanat - %88 uyum)\n' +
          '3. Ali Veli - Kemal Arslan (Orta saha - %85 uyum)\n\n' +
          'Genel takım kimyası %84 seviyesinde, bu ligdeki en iyi 3. değer.',
        suggestions: ['Uyumu artırmak için ne yapmalıyız?', 'En düşük uyumlu oyuncular kimler?', 'Transfer edilecek oyuncuların uyumu nasıl tahmin edilir?']
      };
    }
    else if (lowerInput.includes('sakatlık') || lowerInput.includes('sağlık')) {
      return {
        text: 'Güncel sakatlık durumları:\n\n' +
          '- Ali Veli: Kas ağrısı (2 hafta)\n' +
          '- Kerem Aktürkoğlu: Sorun yok, tamamen fit\n' +
          '- Mehmet Demir: Hafif sakatlıktan döndü, risk taşıyor\n' +
          '- Can Kaya: Fitness seviyesi %90, tam hazır değil\n' +
          '- Diğer oyuncular tamamen hazır durumda.',
        suggestions: ['Alternatif oyuncular kimler olmalı?', 'İyileşme süreleri tahminleri', 'Sakatlıkları önlemek için ne yapmalıyız?']
      };
    }
    else if (lowerInput.includes('transfer')) {
      return {
        text: 'Transfer hedefleri önerileri:\n\n' +
          '1. Sol bek: Takımın yaş ortalamasını düşürecek genç bir oyuncu\n' +
          '2. Defansif orta saha: Top kazanma oranı yüksek, pas yüzdesi iyi bir oyuncu\n' +
          '3. Forvet alternatifi: Son 2 sezonda çift haneli gol sayısına ulaşmış oyuncu\n\n' +
          'Potansiyel adaylar için detaylı analiz hazırlanabilir.',
        suggestions: ['Bütçe planlaması nasıl olmalı?', 'Öncelikli pozisyon hangisi?', 'Özel olarak önerdiğin bir oyuncu var mı?']
      };
    }
    else {
      return {
        text: 'Size nasıl yardımcı olabilirim? Takım performansı, maç analizleri, oyuncu istatistikleri veya taktik önerileri hakkında bilgi verebilirim.',
        suggestions: this.suggestedQueries
      };
    }
  }

  scrollToBottom() {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  addBotGreeting() {
    if (!this.activeConversation) return;

    const greeting: ChatMessage = {
      id: Date.now().toString(),
      from: 'bot',
      text: 'Merhaba! BSkyCoach Futbol Asistanına hoş geldiniz. Size nasıl yardımcı olabilirim?',
      timestamp: new Date(),
      suggestions: this.suggestedQueries
    };

    this.activeConversation.messages.push(greeting);
  }

  deleteConversation(conversationId: string) {
    this.confirmationService.confirm({
      message: 'Bu konuşmayı silmek istediğinize emin misiniz?',
      header: 'Konuşmayı Sil',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.conversations = this.conversations.filter(c => c.id !== conversationId);

        if (this.activeConversation?.id === conversationId) {
          this.activeConversation = this.conversations.length > 0 ? this.conversations[0] : null;

          // Eğer hiç konuşma kalmadıysa yeni bir tane oluştur
          if (!this.activeConversation) {
            this.createNewConversation();
          }
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Silindi',
          detail: 'Konuşma başarıyla silindi'
        });
      }
    });
  }

  confirmDeleteAllConversations() {
    this.confirmationService.confirm({
      message: 'Tüm konuşmaları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      header: 'Tüm Konuşmaları Sil',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.conversations = [];
        this.createNewConversation();

        this.messageService.add({
          severity: 'success',
          summary: 'Silindi',
          detail: 'Tüm konuşmalar başarıyla silindi'
        });
      }
    });
  }

  toggleMobileSidebar() {
    this.isMobileSidebarVisible = !this.isMobileSidebarVisible;
  }

  useSuggestedQuery(query: string) {
    this.userInput = query;
    this.sendMessage();
  }

  getUnreadCount(): number {
    return this.conversations.filter(c => c.unread).length;
  }

  getFormattedDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diff / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} gün önce`;
    } else if (diffHours > 0) {
      return `${diffHours} saat önce`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} dakika önce`;
    } else {
      return 'Az önce';
    }
  }
}
