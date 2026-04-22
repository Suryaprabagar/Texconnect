import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from '../api/axios';
import { Send, Search, User, Paperclip } from 'lucide-react';
import Button from '../components/common/Button';

const MessagesPage = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock conversations
    setConversations([
      { _id: '1', participants: [{ name: 'Oceanic Textiles' }], lastMessage: 'We can deliver in 15 days.', lastMessageAt: new Date() },
      { _id: '2', participants: [{ name: 'Royal Knits' }], lastMessage: 'Sample sent today.', lastMessageAt: new Date() },
    ]);
  }, []);

  const selectConversation = (conv) => {
    setSelectedConv(conv);
    // Mock messages
    setMessages([
      { _id: 'm1', senderId: 'other', content: 'Hello, regarding your RFQ for Cotton T-shirts.', createdAt: new Date() },
      { _id: 'm2', senderId: user?.id, content: 'Hi, what is your best price for 1000 units?', createdAt: new Date() },
      { _id: 'm3', senderId: 'other', content: 'We can do it for ₹140 per unit.', createdAt: new Date() },
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      _id: Date.now().toString(),
      senderId: user?.id,
      content: newMessage,
      createdAt: new Date()
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-120px)]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full pl-9 pr-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {conversations.map(conv => (
              <div 
                key={conv._id}
                onClick={() => selectConversation(conv)}
                className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConv?._id === conv._id ? 'bg-primary-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">{conv.participants[0].name}</h3>
                  <span className="text-[10px] text-gray-400">{new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-grow flex-col">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <User className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900">{selectedConv.participants[0].name}</h3>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.senderId === user?.id 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.senderId === user?.id ? 'text-primary-100' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-grow border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Button type="submit" className="rounded-full p-2 h-10 w-10 flex items-center justify-center">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
