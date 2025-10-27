import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from './LanguageProvider';
import { ChatIcon } from './ui/Icons';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'system', content: t('aiGreeting') }]);
    }
  }, [isOpen, messages.length, t]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const systemInstruction = "You are an expert on Tamil Nadu government employee payroll rules, regulations, and Government Orders (G.O.s). You must answer user questions concisely and accurately in simple language. When possible, cite the relevant G.O. number and date. Format your answers clearly using markdown, such as lists or bold text, for better readability. Start your first response by introducing yourself.";

      const contentsForApi = messages
          .filter(msg => msg.role !== 'system')
          .concat([userMessage])
          .map(msg => ({
              role: msg.role,
              parts: [{ text: msg.content }]
          }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contentsForApi,
        config: {
          systemInstruction: systemInstruction,
        }
      });
      
      const modelResponse: Message = { role: 'model', content: response.text };
      setMessages(prev => [...prev, modelResponse]);

    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage: Message = { role: 'system', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 z-50"
        aria-label={t('askPayrollAI')}
      >
        <ChatIcon />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`fixed bottom-24 right-6 w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col transition-transform duration-300 ease-out z-50 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <header className="p-4 border-b bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-lg text-gray-800">{t('askPayrollAI')}</h3>
        </header>

        <main className="flex-1 p-4 overflow-y-auto h-96">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">AI</span>}
                {msg.role === 'system' && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm">S</span>}
                
                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg ${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 
                    msg.role === 'system' ? 'bg-gray-200 text-gray-700 w-full text-sm' : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }}></p>
                </div>
                
                {msg.role === 'user' && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">U</span>}
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-3">
                 <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">AI</span>
                 <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        <p className="text-center text-xs text-gray-400 px-4">{t('aiDisclaimer')}</p>
        <footer className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>Send</Button>
          </form>
        </footer>
      </div>
    </>
  );
};

export default AIAssistant;