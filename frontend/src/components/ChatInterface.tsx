import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { Message } from '../types';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'faculty',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'student',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Show confirmation
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);

    // Simulate faculty response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. I\'ll get back to you shortly.',
        sender: 'faculty',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setInputValue('Can I get an extension for my assignment?');
        setIsListening(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] z-50 animate-scale-in">
      <Card className="h-full flex flex-col shadow-soft-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Chat with Faculty</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Delivery Method Selector */}
        <div className="p-4 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Send via:</span>
            <div className="flex items-center space-x-2">
              {[
                { value: 'sms', icon: Smartphone, label: 'SMS' },
                { value: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
                { value: 'email', icon: Mail, label: 'Email' }
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setDeliveryMethod(method.value as any)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    deliveryMethod === method.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <method.icon className="w-3 h-3" />
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confirmation Banner */}
        {showConfirmation && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 animate-slide-up">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Message sent to Faculty via {deliveryMethod.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-soft ${
                  message.sender === 'student'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'student' ? 'text-primary-100' : 'text-neutral-500 dark:text-neutral-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleVoiceToggle}
              className={`p-3 rounded-xl transition-all duration-200 shadow-soft ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600 scale-110'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Type your message here..."}
              className="flex-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-600 transition-colors"
              disabled={isListening}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isListening}
              size="sm"
              className="px-4 py-3 shadow-soft"
            >
              <Send size={16} />
            </Button>
          </div>
          
          {isListening && (
            <div className="mt-3 text-center animate-fade-in">
              <div className="inline-flex items-center space-x-2 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording...</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};