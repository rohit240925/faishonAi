// src/pages/customer-portal/components/SupportWidget.jsx
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SupportWidget = ({ isOpen, onOpen, onClose, customer }) => {
  const [view, setView] = useState('main'); // main, chat, tickets
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: `Hi ${customer?.name?.split(' ')?.[0] || 'there'}! I'm here to help. What can I assist you with today?`,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (isOpen && view === 'chat') {
      inputRef?.current?.focus();
    }
  }, [isOpen, view]);

  const quickActions = [
    {
      id: 'billing',
      title: 'Billing Question',
      description: 'Invoice, payments, or billing issues',
      icon: 'CreditCard',
      action: () => setView('chat')
    },
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'API issues, integrations, or bugs',
      icon: 'Code',
      action: () => setView('tickets')
    },
    {
      id: 'account',
      title: 'Account Help',
      description: 'Account settings or subscription changes',
      icon: 'User',
      action: () => setView('chat')
    },
    {
      id: 'general',
      title: 'General Question',
      description: 'Other questions or feedback',
      icon: 'MessageCircle',
      action: () => setView('chat')
    }
  ];

  const ticketCategories = [
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'account', label: 'Account Management' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-success' },
    { value: 'medium', label: 'Medium', color: 'text-warning' },
    { value: 'high', label: 'High', color: 'text-error' },
    { value: 'urgent', label: 'Urgent', color: 'text-error' }
  ];

  const handleSendMessage = () => {
    if (!message?.trim()) return;

    const newMessage = {
      id: chatMessages?.length + 1,
      type: 'user',
      message: message?.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: chatMessages?.length + 2,
        type: 'bot',
        message: "Thank you for your message! I\'m connecting you with a support agent who will help you shortly. In the meantime, you can also check our Help Center for quick answers.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSubmitTicket = () => {
    console.log('Submitting ticket:', ticketForm);
    // Reset form and show success
    setTicketForm({
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    });
    setView('main');
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-all duration-200 hover:scale-105 z-50"
        aria-label="Open support chat"
      >
        <Icon name="MessageCircle" size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-surface rounded-lg shadow-modal border border-border-light z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-light bg-primary text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          {view !== 'main' && (
            <button
              onClick={() => setView('main')}
              className="p-1 hover:bg-primary-600 rounded transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
            </button>
          )}
          <div>
            <h3 className="font-semibold">
              {view === 'main' && 'How can we help?'}
              {view === 'chat' && 'Support Chat'}
              {view === 'tickets' && 'Submit Ticket'}
            </h3>
            {view === 'chat' && (
              <p className="text-xs text-primary-100">We typically reply in a few minutes</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-primary-600 rounded transition-colors"
        >
          <Icon name="X" size={20} />
        </button>
      </div>
      {/* Content */}
      <div className="h-96 overflow-hidden">
        {/* Main View */}
        {view === 'main' && (
          <div className="p-4 space-y-3">
            <p className="text-sm text-text-secondary mb-4">
              Choose how you'd like to get help:
            </p>
            {quickActions?.map((action) => (
              <button
                key={action?.id}
                onClick={action?.action}
                className="w-full flex items-center space-x-3 p-3 border border-border-light rounded-lg hover:bg-surface-hover transition-colors text-left"
              >
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Icon name={action?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">{action?.title}</h4>
                  <p className="text-xs text-text-secondary">{action?.description}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-text-tertiary" />
              </button>
            ))}
            
            <div className="pt-3 border-t border-border-light">
              <button className="w-full flex items-center justify-center space-x-2 p-2 text-sm text-primary hover:bg-primary-50 rounded-lg transition-colors">
                <Icon name="ExternalLink" size={16} />
                <span>Visit Help Center</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat View */}
        {view === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages?.map((msg) => (
                <div
                  key={msg?.id}
                  className={`flex ${msg?.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      msg?.type === 'user' ?'bg-primary text-white' :'bg-surface-hover text-text-primary'
                    }`}
                  >
                    <p className="text-sm">{msg?.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg?.type === 'user' ? 'text-primary-100' : 'text-text-tertiary'
                    }`}>
                      {formatTime(msg?.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-hover text-text-primary rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-border-light">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e?.target?.value)}
                  onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message?.trim()}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Form View */}
        {view === 'tickets' && (
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Subject
              </label>
              <input
                type="text"
                value={ticketForm?.subject}
                onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e?.target?.value }))}
                placeholder="Brief description of your issue"
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <select
                value={ticketForm?.category}
                onChange={(e) => setTicketForm(prev => ({ ...prev, category: e?.target?.value }))}
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a category</option>
                {ticketCategories?.map((cat) => (
                  <option key={cat?.value} value={cat?.value}>
                    {cat?.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Priority
              </label>
              <select
                value={ticketForm?.priority}
                onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e?.target?.value }))}
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {priorities?.map((priority) => (
                  <option key={priority?.value} value={priority?.value}>
                    {priority?.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={ticketForm?.description}
                onChange={(e) => setTicketForm(prev => ({ ...prev, description: e?.target?.value }))}
                placeholder="Please provide detailed information about your issue..."
                rows={4}
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
            
            <button
              onClick={handleSubmitTicket}
              disabled={!ticketForm?.subject || !ticketForm?.category || !ticketForm?.description}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Submit Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportWidget;