import axios from './axios';

export const getConversations = async () => {
  const response = await axios.get('/messages/conversations');
  return response.data.data.conversations;
};

export const getOrCreateConversation = async (recipientId, subject, rfqId, productId) => {
  const response = await axios.post('/messages/conversations', {
    recipientId,
    subject,
    rfqId,
    productId
  });
  return response.data.data.conversation;
};

export const getMessages = async (conversationId) => {
  const response = await axios.get(`/messages/conversations/${conversationId}/messages`);
  return response.data.data.messages;
};

export const sendMessage = async (conversationId, content, type = 'text', metadata = {}) => {
  const response = await axios.post(`/messages/conversations/${conversationId}/messages`, {
    content,
    type,
    metadata
  });
  return response.data.data.message;
};

export const deleteConversation = async (conversationId) => {
  const response = await axios.delete(`/messages/conversations/${conversationId}`);
  return response.data;
};
