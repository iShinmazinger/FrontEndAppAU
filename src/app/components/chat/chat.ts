import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: number;
  created: string;
}

@Component({
  selector: 'app-chat',
  imports: [ CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})

export class Chat implements OnInit {
  apiUrl = `${environment.apiUrl}/api/chat`;
  messages: Message[] = [];
  userMessage = '';
  conversations: Conversation[] = [];
  loading = false;
  showHistory=false
  currentConversationId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadHistory();
    this.startNewConversation();
  }

  loadHistory(): void {
    this.http.get<{ conversations: Conversation[] }>(`${this.apiUrl}/history`)
      .subscribe({
        next: (res) => this.conversations = res.conversations,
        error: (err) => console.error('Error al obtener historial:', err)
      });
  }

  openConversation(convId: number): void {
    this.http.get<{ conversation: any, messages: Message[] }>(`${this.apiUrl}/history/${convId}`)
      .subscribe({
        next: (res) => {
          this.messages = res.messages;
          this.currentConversationId = convId;
          this.showHistory = false;
        },
        error: (err) => console.error('Error al abrir conversación:', err)
      });
  }

  startNewConversation(): void {
    this.messages = [{
      role: 'assistant',
      content: '🌿 ¡Hola! Soy tu asesor de Agricultura Urbana. Para empezar, cuéntame qué espacio tienes para cultivar en casa.'
    }];
    this.currentConversationId = null;
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    const messageToSend = this.userMessage;
    this.messages.push({ role: 'user', content: messageToSend });
    this.userMessage = '';
    this.loading = true;

    this.http.post<{ reply: string; conversationId: number }>(
      `${this.apiUrl}/send`,
      { content: messageToSend }
    ).subscribe({
      next: (res) => {
        this.loading = false;
        this.messages.push({ role: 'assistant', content: res.reply });
        if (!this.currentConversationId) {
          this.currentConversationId = res.conversationId;
          this.loadHistory();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en la conversación:', err);
        this.messages.push({
          role: 'assistant',
          content: 'Ocurrió un error al comunicarme con la IA. Intenta nuevamente.'
        });
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}