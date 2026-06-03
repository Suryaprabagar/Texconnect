import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import * as messageService from '../api/messageService';

const MessagesPage = () => {
  const { user } = useAuthStore();
  const currentUserId = user?._id || user?.id;
  const location = useLocation();
  const addToast = useToastStore((state) => state.addToast);
  
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Helper to safely compare IDs regardless of format (string vs object)
  const compareIds = (id1, id2) => {
    if (!id1 || !id2) return false;
    const s1 = id1._id || id1.id || id1;
    const s2 = id2._id || id2.id || id2;
    return s1.toString() === s2.toString();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const data = await messageService.getConversations();
        setConversations(data || []);
        
        // Check if we were redirected here to start a new conversation
        if (location.state?.recipientId) {
          const { recipientId, subject, rfqId, productId } = location.state;
          const newConv = await messageService.getOrCreateConversation(recipientId, subject, rfqId, productId);
          
          // Refresh conversations to include the new one if it was just created
          const updatedData = await messageService.getConversations();
          setConversations(updatedData || []);
          
          const foundConv = updatedData?.find(c => compareIds(c._id, newConv._id));
          if (foundConv) {
            selectConversation(foundConv);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        addToast('Failed to load conversations', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [location.state]);

  const selectConversation = async (conv) => {
    if (!conv) return;
    setSelectedConv(conv);
    setShowMobileChat(true);
    setIsMessagesLoading(true);
    setMessages([]); // Clear previous messages
    
    // Clear unread count locally for immediate feedback
    setConversations(prev => prev.map(c => 
      compareIds(c._id, conv._id)
        ? { ...c, unreadCount: { ...c.unreadCount, [currentUserId]: 0 } } 
        : c
    ));
    
    try {
      const messages = await messageService.getMessages(conv._id);
      setMessages(messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      addToast('Failed to load messages', 'error');
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedConv || isSending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const message = await messageService.sendMessage(selectedConv._id, content);
      if (message) {
        setMessages(prev => [...prev, message]);
        
        // Update the conversation's last message in the list
        setConversations(prev => prev.map(c => 
          compareIds(c._id, selectedConv._id)
            ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() }
            : c
        ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addToast('Failed to send message', 'error');
      setNewMessage(content); // Restore content on failure
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConv) return;
    if (!window.confirm('Are you sure you want to delete this conversation? This will delete all messages for both users.')) {
      return;
    }

    try {
      await messageService.deleteConversation(selectedConv._id);
      addToast('Conversation deleted successfully', 'success');
      
      setConversations(prev => prev.filter(c => !compareIds(c._id, selectedConv._id)));
      setSelectedConv(null);
      setMessages([]);
      setShowMobileChat(false);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      addToast('Failed to delete conversation', 'error');
    }
  };

  const backToInbox = () => {
    setShowMobileChat(false);
  };

  const getRecipient = (conv) => {
    if (!conv || !conv.participants) return null;
    return conv.participants.find(p => !compareIds(p, currentUserId));
  };

  return (
    <div className="h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] flex bg-white rounded-3xl shadow-soft border border-slate-50 overflow-hidden">
      {/* Sidebar - Inbox */}
      <section className={`${showMobileChat ? 'hidden' : 'flex'} lg:flex w-full lg:w-[380px] border-r border-slate-50 flex-col bg-white`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900">Chat</h2>
          <button 
            onClick={() => addToast('Start new conversation coming soon!', 'info')}
            className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center hover:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-2 bg-slate-100 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length > 0 ? conversations.map(conv => {
            const recipient = getRecipient(conv);
            return (
              <div 
                key={conv._id}
                onClick={() => selectConversation(conv)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedConv?._id === conv._id ? 'bg-primary/5 border border-primary/10' : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-primary font-bold">
                    {recipient?.name?.charAt(0) || '?'}
                  </div>
                  {/* {conv.online && <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>} */}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className={`text-sm font-bold truncate ${selectedConv?._id === conv._id ? 'text-primary' : 'text-slate-900'}`}>
                      {recipient?.name || 'User'}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[10px] text-primary font-bold truncate mb-1">
                    {conv.subject || 'New Inquiry'}
                  </p>
                  <p className={`text-xs truncate ${conv.unreadCount?.[currentUserId] > 0 ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>
                {conv.unreadCount?.[currentUserId] > 0 && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-black">{conv.unreadCount[currentUserId]}</span>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="text-center py-20 opacity-20">
               <span className="material-symbols-outlined text-4xl block mb-2">mail</span>
               <p className="text-[10px] font-black uppercase tracking-widest">No messages</p>
            </div>
          )}
        </div>
      </section>

      {/* Chat Area */}
      <section className={`${showMobileChat ? 'flex' : 'hidden'} lg:flex flex-1 flex flex-col bg-slate-50/30`}>
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="h-16 lg:h-20 px-4 lg:px-8 flex items-center justify-between bg-white border-b border-slate-50 shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={backToInbox} className="lg:hidden p-2 -ml-2 text-slate-400">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary font-bold text-xs lg:text-sm">
                  {getRecipient(selectedConv)?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="text-xs lg:text-sm font-black text-slate-900 leading-tight">
                    {getRecipient(selectedConv)?.name || 'User'}
                  </h2>
                  <p className="text-[10px] text-primary font-bold truncate max-w-[150px] lg:max-w-[300px]">
                    {selectedConv.subject || 'New Inquiry'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <button 
                  onClick={handleDeleteConversation} 
                  className="w-9 h-9 lg:w-10 lg:h-10 hover:bg-red-50 hover:text-red-500 rounded-xl text-slate-400 transition-all flex items-center justify-center"
                  title="Delete Chat"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
                <button onClick={() => addToast('Calling coming soon!', 'info')} className="w-9 h-9 lg:w-10 lg:h-10 hover:bg-slate-50 rounded-xl text-slate-400 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-xl">call</span></button>
                <button onClick={() => addToast('More options coming soon!', 'info')} className="w-9 h-9 lg:w-10 lg:h-10 hover:bg-slate-50 rounded-xl text-slate-400 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-xl">more_vert</span></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
              {isMessagesLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div className="w-2/3 h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : messages.length > 0 ? (
                <>
                  {messages.map((msg, index) => (
                    <div key={msg._id || index} className={`flex ${compareIds(msg.senderId, currentUserId) ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] lg:max-w-[70%] group`}>
                        <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium ${
                          compareIds(msg.senderId, currentUserId) 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white text-slate-700 border border-slate-50 rounded-bl-none'
                        }`}>
                          {msg.content}
                        </div>
                        <p className={`text-[10px] font-bold uppercase mt-1.5 px-1 tracking-widest ${compareIds(msg.senderId, currentUserId) ? 'text-right text-slate-400' : 'text-slate-300'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-5xl mb-2 text-slate-300">chat_bubble</span>
                  <p className="text-xs font-black uppercase tracking-widest">No messages yet</p>
                  <p className="text-[10px] font-medium mt-1">Send a message to start the conversation</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 lg:p-6 bg-white border-t border-slate-50">
              <form onSubmit={handleSend} className="flex items-end gap-2 lg:gap-4 max-w-5xl mx-auto">
                <button onClick={() => addToast('Attachments coming soon!', 'info')} type="button" className="hidden sm:flex w-10 h-10 text-slate-400 hover:text-primary transition-colors items-center justify-center shrink-0"><span className="material-symbols-outlined">add_circle</span></button>
                
                <div className="flex-1 bg-slate-50 rounded-2xl flex items-center px-4">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 resize-none max-h-32 placeholder:text-slate-300 font-medium" 
                    placeholder="Type a message..." 
                    rows="1"
                    disabled={isSending}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="w-11 h-11 lg:w-12 lg:h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-95 active:scale-90 transition-all shrink-0 disabled:opacity-50 disabled:scale-100"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-soft flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-200">chat_bubble</span>
            </div>
            <p className="font-bold text-sm uppercase tracking-widest leading-relaxed">Select a conversation to start chatting with verified suppliers</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MessagesPage;
