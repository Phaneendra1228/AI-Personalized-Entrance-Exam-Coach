'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { sendChat } from '@/lib/api';
import type { ChatMessage } from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';

const QUICK_PROMPTS = [
  "What are my weakest topics?",
  "What should I study today?",
  "Explain probability to me",
  "How can I improve my accuracy?",
  "Give me a motivational message",
];

export default function CoachPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: t('coach.greeting') },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check speech recognition support
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      setSpeechSupported(true);
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleSend = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || sending) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await sendChat({
        student_id: STUDENT_ID,
        message,
        history: messages.slice(1).filter((m) => m.role !== 'assistant' || m.content),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: t('coach.errorMsg'),
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col slide-in">
      {/* Header */}
      <div className="glass p-4 mb-4 flex items-center gap-3" style={{ borderRadius: '12px' }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
        >
          🤖
        </div>
        <div>
          <div className="font-semibold">LearnBot — AI Coach</div>
          <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            Ready to help
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {speechSupported && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
              🎤 Voice Ready
            </span>
          )}
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
            Gemini / GPT-4
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
              >
                🤖
              </div>
            )}
            <div
              className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
              style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'var(--bg-card)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              }}
            >
              {msg.content.split('\n').map((line, j) => (
                <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
              ))}
            </div>
            {msg.role === 'user' && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 mt-1 font-bold"
                style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1' }}
              >
                S
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex gap-3 justify-start">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
            >
              🤖
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px' }}
            >
              <div className="flex gap-1.5 items-center h-4">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: '#6366f1',
                      animation: `pulse-dot 1.2s ease-in-out ${delay}ms infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        className="glass p-3 flex gap-3 items-end"
        style={{ borderRadius: '12px' }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={listening ? '🎤 Listening...' : 'Ask me anything... (Enter to send, Shift+Enter for new line)'}
          rows={1}
          className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
          style={{ color: 'var(--text-primary)', minHeight: '24px', maxHeight: '120px' }}
        />
        {/* Voice input button */}
        {speechSupported && (
          <button
            onClick={toggleListening}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: listening ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.15)',
              border: `1px solid ${listening ? '#ef4444' : '#22c55e'}44`,
            }}
            title={listening ? 'Stop listening' : 'Start voice input'}
          >
            {listening ? '🔴' : '🎤'}
          </button>
        )}
        {/* Send button */}
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || sending}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
