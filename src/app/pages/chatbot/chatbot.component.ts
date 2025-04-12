import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  messages: { from: 'user' | 'bot'; text: string }[] = [
    { from: 'bot', text: 'Merhaba! Size nasıl yardımcı olabilirim?' }
  ];

  userInput = '';

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ from: 'user', text: this.userInput });

    // Mock bot yanıtı
    setTimeout(() => {
      this.messages.push({ from: 'bot', text: 'Bu sadece örnek bir yanıttır.' });
    }, 500);

    this.userInput = '';
  }
}
