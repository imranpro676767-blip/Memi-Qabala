import React, { useState } from 'react';
import { ChatMessage, AutoReplyRule } from '../types';
import { MessageSquare, MessageCircle, X, Send } from 'lucide-react';

interface ChatOverlayProps {
  whatsappNumber: string;
  chatMessages: ChatMessage[];
  autoReplyEnabled: boolean;
  autoReplies: AutoReplyRule[];
  autoReplyFallback: string;
  isChatOpen: boolean;
  setIsChatOpen: (o: boolean) => void;
  onSendMessage: (text: string) => void;
  lang: string;
  t: any;
}

export default function ChatOverlay({
  whatsappNumber,
  chatMessages,
  autoReplyEnabled,
  autoReplies,
  autoReplyFallback,
  isChatOpen,
  setIsChatOpen,
  onSendMessage,
  lang,
  t,
}: ChatOverlayProps) {
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo.jpg');

  const cleanNum = whatsappNumber.replace(/\D/g, '');

  const getFormattedWhatsAppNumber = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.length === 12 && clean.startsWith('994')) {
      return `+994 (${clean.slice(3, 5)}) ${clean.slice(5, 8)} ${clean.slice(8, 10)} ${clean.slice(10, 12)}`;
    }
    return `+${clean}`;
  };

  const formattedWhatsApp = getFormattedWhatsAppNumber(whatsappNumber);

  const handleSendLocal = (overrideText?: string) => {
    const text = overrideText || chatInput;
    if (!text.trim()) return;

    onSendMessage(text);
    if (!overrideText) {
      setChatInput('');
    }
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4">
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${cleanNum}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-600 hover:scale-110 active:scale-95 duration-200 transition-all cursor-pointer relative group"
        title="WhatsApp Dəstək"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
        <span className="absolute right-16 scale-0 group-hover:scale-100 bg-neutral-900/95 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg whitespace-nowrap duration-200 origin-right shadow text-center select-none leading-relaxed">
          {lang === 'az' ? 'WhatsApp Canlı Dəstək' : lang === 'ru' ? 'WhatsApp Поддержка' : 'WhatsApp Support'}
        </span>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FAF9F5] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C2A476]"></span>
        </span>
      </a>

      {/* Chat Bot Widget Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 bg-emerald-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-950 hover:scale-110 active:scale-95 duration-200 transition-all cursor-pointer relative group"
        title="Canlı Dəstək Söhbəti"
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isChatOpen && (
          <span className="absolute right-16 bg-neutral-900/90 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg whitespace-nowrap shadow opacity-90 select-none">
            {lang === 'az' ? 'Sualın var? Canlı Çat' : 'Live Chat support'}
          </span>
        )}
      </button>

      {/* Chat Card Box Modal */}
      {isChatOpen && (
        <div className="w-80 md:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-150 flex flex-col justify-between max-h-[480px] z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Card Header */}
          <div className="bg-neutral-900 p-4 text-white flex justify-between items-center select-none border-b-2 border-emerald-800">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 bg-white p-1">
                  <img
                    src={logoSrc}
                    alt="Bot Logo"
                    onError={() => {
                      if (logoSrc === '/logo.jpg') {
                        setLogoSrc('/logo.png');
                      } else if (logoSrc === '/logo.png') {
                        setLogoSrc('/logo.svg');
                      } else if (logoSrc !== 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format') {
                        setLogoSrc('https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format');
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-neutral-900 rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-[11px] font-black tracking-wide uppercase">{lang === 'az' ? 'MEMİ BOT CANLI DƏSTƏK' : 'MEMI CHAT BOT'}</h4>
                <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 leading-none">
                  🟢 {lang === 'az' ? 'Aktivdir (Sürətli Cavab)' : 'Online Support'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 p-4 bg-neutral-50/50 overflow-y-auto space-y-3.5 max-h-[320px] scroll-smooth hide-scrollbar min-h-[200px]"
            id="chat-messages-container"
          >
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${
                  m.sender === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-[12px] font-semibold leading-relaxed shadow-sm text-left ${
                    m.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-tr-none'
                      : 'bg-white text-neutral-800 border rounded-tl-none border-neutral-100'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[8px] text-neutral-400 font-mono mt-1 font-bold">
                  {m.time}
                </span>
              </div>
            ))}

            {/* Typing Anim */}
            {isTyping && (
              <div className="flex flex-col items-start mr-auto max-w-[80%]">
                <div className="bg-white p-3 border border-neutral-100 rounded-2xl rounded-tl-none flex space-x-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[7px] text-neutral-400 font-sans font-bold mt-1 block">
                  Memi Bot yazır...
                </span>
              </div>
            )}
          </div>

          {/* Canned Quick Links with Az, En translations triggers */}
          <div className="px-3 py-1.5 bg-neutral-100/60 border-t border-neutral-100 gap-1 flex flex-wrap max-h-24 overflow-y-auto">
            {[
              {
                l: lang === 'az' ? 'Ölçü sualım var' : 'Size questions',
                q: lang === 'az' ? 'Məhsulların ölçü cədvəli haqqında öyrənmək istəyirəm.' : 'Explain the size parameters',
              },
              {
                l: lang === 'az' ? 'Çatdırılma necədir?' : 'Delivery methods',
                q: lang === 'az' ? 'Sifarişlərin çatdırılma qaydası necədir?' : 'How is country-wide delivery done?',
              },
              {
                l: lang === 'az' ? 'Qaytarılma varmı?' : 'Returns & refunds',
                q: lang === 'az' ? 'Məhsulu bəyənməsəm geri qaytarma qaydanız necədir?' : 'What is your product return policy?',
              },
              {
                l: lang === 'az' ? 'WhatsApp xətti' : 'Direct WhatsApp',
                q: lang === 'az' ? 'Sizə WhatsApp dəstək xətti vasitəsilə yazmaq istəyirəm.' : 'Give me direct admin WhatsApp connection',
              },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendLocal(item.q)}
                className="text-[9px] bg-white border border-neutral-200/80 hover:border-emerald-700/40 text-neutral-600 hover:text-emerald-800 font-bold px-2.5 py-1 rounded-xl transition-all font-sans cursor-pointer h-6 flex items-center"
              >
                💡 {item.l}
              </button>
            ))}
          </div>

          {/* Text input form */}
          <div className="p-3 border-t bg-white flex items-center space-x-2">
            <input
              type="text"
              placeholder={lang === 'az' ? 'Mesajınızı yazın...' : 'Type feedback...'}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendLocal();
                }
              }}
              className="flex-1 bg-neutral-50 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-800/10 outline-none border"
            />
            <button
              onClick={() => handleSendLocal()}
              className="p-2 bg-emerald-850 hover:bg-emerald-900 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
