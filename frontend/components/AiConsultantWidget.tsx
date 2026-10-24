'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const INITIAL_GREETING = `Xin chào! Tôi là **Cố Vấn Chiến Lược INSIGHT AI**.

Tôi luôn trực tuyến **24/7** để hỗ trợ bạn:
• 🏛️ **Bảo chứng nguồn gốc dữ liệu:** Bộ dữ liệu 1 triệu hồ sơ *Nemotron-Personas-Vietnam* của **FPT & NVIDIA** ([Báo Nhân Dân 17/10/2026](https://nhandan.vn/fpt-va-nvidia-mo-rong-bo-du-lieu-nguoi-dung-gia-lap-viet-nam-len-1-trieu-ban-ghi-post995998.html)), PII-Free 100% Nghị định 13/2023/NĐ-CP.
• 📊 **9 Mô hình nghiên cứu chuẩn quốc tế:** Nielsen BASES, Van Westendorp, Kantar Link, Monadic...
• 🧪 **Gói kiểm thử thực tế:** Chỉ **10.000đ** (50 mẫu) để bạn test quét VietQR thật và nhận báo cáo ngay.

Bạn đang quan tâm đến nội dung nào?`;

const QUICK_PROMPTS = [
  '🏛️ Nguồn dữ liệu FPT-NVIDIA & Tính pháp lý?',
  '🧪 Tôi muốn thử gói 10k test thanh toán thật',
  '📊 Xem báo cáo mẫu thực tế chuẩn HĐQT',
  '💎 Mô hình Van Westendorp định giá ra sao?',
];

export default function AiConsultantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: INITIAL_GREETING,
      time: 'Vừa xong',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewBadge(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.askAiConsultant(text, historyPayload);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'Dạ hiện tại kênh AI đang nhận lượng truy vấn cao. Bạn có thể xem ngay Báo cáo mẫu thực tế tại [Live Demo A4](https://insight.1booking.asia/results/DEMO-NIELSEN-BASES) hoặc trải nghiệm gói test 10k tại [Khởi tạo khảo sát](https://insight.1booking.asia/wizard?sample=50).',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedContent = (content: string) => {
    // Chuyển markdown links [text](url) thành thẻ <a>
    const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, index) => {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const linkText = match[1];
        const linkUrl = match[2];
        const isExternal = linkUrl.startsWith('http');
        return (
          <a
            key={index}
            href={linkUrl}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noreferrer' : undefined}
            className="text-amber-600 hover:text-amber-700 underline font-semibold transition-colors"
          >
            {linkText}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* ── Floating Launcher Button ── */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
        {/* Nút chính */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 border ${
            isOpen
              ? 'bg-slate-900 border-slate-700 text-white'
              : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-amber-500/60 text-white hover:scale-105 hover:border-amber-400'
          }`}
          aria-label="Mở Trợ lý Cố vấn AI 24/7"
        >
          {/* Chấm tròn xanh chỉ thị trực tuyến */}
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>

          <span className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
            <span>💬</span>
            <span className="hidden sm:inline">Trợ lý Cố vấn AI</span>
            <span className="sm:hidden">Hỏi AI</span>
            <span className="text-amber-400 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30">
              24/7
            </span>
          </span>

          {hasNewBadge && !isOpen && (
            <span className="absolute -top-2 -left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-bounce">
              Tư vấn FPT·NVIDIA
            </span>
          )}
        </button>
      </div>

      {/* ── Slide-up Interactive Chat Drawer ── */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[92vw] sm:w-[410px] max-h-[82vh] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-serif text-lg font-bold">
                ✦
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Cố Vấn Chiến Lược AI</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono px-1.5 py-0.2 rounded">
                    ONLINE
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Nguồn dữ liệu FPT &amp; NVIDIA · 1M Hồ sơ
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors text-lg"
              title="Thu nhỏ cửa sổ"
            >
              ✕
            </button>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 py-2 text-[11px] text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span>📰</span>
              <span>Được bảo chứng bởi Báo Nhân Dân &amp; GSO</span>
            </span>
            <Link
              href="/wizard?sample=50"
              className="text-amber-800 font-bold underline hover:text-amber-950 text-[11px]"
            >
              Test 10k →
            </Link>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {renderFormattedContent(m.content)}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs w-28 text-slate-500 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-medium">Đang trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-300 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Đặt câu hỏi về phương pháp, pháp lý, bảng giá..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 border border-slate-300 focus:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-400 flex items-center justify-center transition-all shrink-0 font-bold"
              title="Gửi tin nhắn"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
