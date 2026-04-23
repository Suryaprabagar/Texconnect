import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const MessagesPage = () => {
  const { user } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    // Mock conversations for demonstration
    setConversations([
      { 
        _id: 'c1', 
        name: 'Tex India Pvt Ltd', 
        img: 'https://images.unsplash.com/photo-1558278226-9fa105821c7a?auto=format&fit=crop&q=80&w=100',
        lastMsg: "Yes, the 400TC samples are ready.",
        time: '10:42 AM',
        unread: 1,
        online: true
      },
      { 
        _id: 'c2', 
        name: 'Suryaprabagar Knits', 
        img: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=100',
        lastMsg: "Can you confirm the lead time?",
        time: 'Yesterday',
        unread: 0,
        online: false
      },
    ]);
  }, []);

  const selectConversation = (conv) => {
    setSelectedConv(conv);
    setShowMobileChat(true);
    setMessages([
      { _id: 'm1', senderId: 'other', content: `Hello, we've reviewed your request from ${conv.name}.`, time: '10:30 AM' },
      { _id: 'm2', senderId: user?.id, content: "Great! What is the estimated delivery time for Tirupur hub?", time: '10:35 AM' },
      { _id: 'm3', senderId: 'other', content: conv.lastMsg, time: conv.time },
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { _id: Date.now().toString(), senderId: user?.id, content: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMessage('');
  };

  const backToInbox = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] flex bg-white rounded-3xl shadow-soft border border-slate-50 overflow-hidden">
      {/* Sidebar - Inbox */}
      <section className={`${showMobileChat ? 'hidden' : 'flex'} lg:flex w-full lg:w-[380px] border-r border-slate-50 flex-col bg-white`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900">Inbox</h2>
          <button 
            onClick={() => addToast('Start new conversation coming soon!', 'info')}
            className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center hover:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {conversations.length > 0 ? conversations.map(conv => (
            <div 
              key={conv._id}
              onClick={() => selectConversation(conv)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                selectedConv?._id === conv._id ? 'bg-primary/5 border border-primary/10' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={conv.img} className="w-12 h-12 rounded-xl object-cover" alt={conv.name} />
                {conv.online && <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className={`text-sm font-bold truncate ${selectedConv?._id === conv._id ? 'text-primary' : 'text-slate-900'}`}>{conv.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{conv.time}</span>
                </div>
                <p className={`text-xs truncate ${conv.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>{conv.lastMsg}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-black">{conv.unread}</span>
                </div>
              )}
            </div>
          )) : (
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
                <img src={selectedConv.img} className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl object-cover" alt={selectedConv.name} />
                <div>
                  <h2 className="text-xs lg:text-sm font-black text-slate-900 leading-tight">{selectedConv.name}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedConv.online ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{selectedConv.online ? 'Active Now' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <button onClick={() => addToast('Calling coming soon!', 'info')} className="w-9 h-9 lg:w-10 lg:h-10 hover:bg-slate-50 rounded-xl text-slate-400 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-xl">call</span></button>
                <button onClick={() => addToast('More options coming soon!', 'info')} className="w-9 h-9 lg:w-10 lg:h-10 hover:bg-slate-50 rounded-xl text-slate-400 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-xl">more_vert</span></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] lg:max-w-[70%] group`}>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium ${
                      msg.senderId === user?.id 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white text-slate-700 border border-slate-50 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] font-bold uppercase mt-1.5 px-1 tracking-widest ${msg.senderId === user?.id ? 'text-right text-slate-400' : 'text-slate-300'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
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
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-11 h-11 lg:w-12 lg:h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-95 active:scale-90 transition-all shrink-0"
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
