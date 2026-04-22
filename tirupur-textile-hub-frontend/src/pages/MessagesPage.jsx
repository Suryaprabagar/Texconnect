import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const MessagesPage = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Mock conversations
    setConversations([
      { _id: '1', name: 'Cotton Craft Int.', lastMsg: 'Yes, the 400TC samples are ready.', time: '10:42 AM', unread: 0, online: true, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
      { _id: '2', name: 'Linen Wonders', lastMsg: 'Looking forward to the quotation.', time: 'Yesterday', unread: 0, online: false, img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100' },
      { _id: '3', name: 'Silk Route Sourcing', lastMsg: 'The shipping delay was cleared today.', time: 'Mon', unread: 2, online: true, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    ]);
  }, []);

  const selectConversation = (conv) => {
    setSelectedConv(conv);
    setMessages([
      { _id: 'm1', senderId: 'other', content: "Hello, we've reviewed your request for the 400TC Egyptian Cotton. The pricing you requested is feasible for a 5000-meter order.", time: '10:30 AM' },
      { _id: 'm2', senderId: user?.id, content: "That's great news. Can you confirm the lead time for the first batch? We need at least 1000 meters by next Friday.", time: '10:35 AM' },
      { _id: 'm3', senderId: 'other', content: "Yes, the 400TC samples are ready. I'll send the tracking number shortly.", time: '10:42 AM' },
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { _id: Date.now().toString(), senderId: user?.id, content: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-3xl shadow-soft border border-slate-50 overflow-hidden">
      {/* Sidebar */}
      <section className="w-[380px] border-r border-slate-50 flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900">Inbox</h2>
          <button className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center hover:scale-95 transition-transform">
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {conversations.map(conv => (
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
          ))}
        </div>
      </section>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col bg-slate-50/30">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="h-20 px-8 flex items-center justify-between bg-white border-b border-slate-50 shrink-0">
              <div className="flex items-center gap-4">
                <img src={selectedConv.img} className="w-10 h-10 rounded-xl object-cover" alt={selectedConv.name} />
                <div>
                  <h2 className="text-sm font-black text-slate-900">{selectedConv.name}</h2>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedConv.online ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{selectedConv.online ? 'Active Now' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 hover:bg-slate-50 rounded-xl text-slate-400 transition-all flex items-center justify-center"><span className="material-symbols-outlined">call</span></button>
                <button className="w-10 h-10 hover:bg-slate-50 rounded-xl text-slate-400 transition-all flex items-center justify-center"><span className="material-symbols-outlined">videocam</span></button>
                <button className="w-10 h-10 hover:bg-slate-50 rounded-xl text-slate-400 transition-all flex items-center justify-center"><span className="material-symbols-outlined">info</span></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] group`}>
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
            <div className="p-6 bg-white border-t border-slate-50">
              <form onSubmit={handleSend} className="flex items-end gap-4 max-w-5xl mx-auto">
                <div className="flex gap-1 mb-1">
                  <button type="button" className="w-10 h-10 text-slate-400 hover:text-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined">add_circle</span></button>
                  <button type="button" className="w-10 h-10 text-slate-400 hover:text-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined">image</span></button>
                </div>
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
                  className="mb-1 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-95 active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-soft flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-200">chat_bubble</span>
            </div>
            <p className="font-bold text-sm uppercase tracking-widest">Select a conversation to start</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MessagesPage;
