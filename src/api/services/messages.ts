import API from "../axios";

export interface Message {
  _id: string;
  content: string;
  channel: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMessages {
  messages: Message[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export async function getMessages(channelId: string, params?: { page?: number; limit?: number; before?: string }) {
  const { data } = await API.get<PaginatedMessages>(`/messages/channel/${channelId}`, { params });
  return data;
}

export async function sendMessage(channelId: string, payload: { content: string; attachments?: any[] }) {
  const { data } = await API.post(`/messages/channel/${channelId}`, payload);
  return data as Message;
}

export async function replyToMessage(messageId: string, payload: { content: string }) {
  const { data } = await API.post(`/messages/${messageId}/reply`, payload);
  return data as Message;
}

export async function editMessage(messageId: string, payload: { content: string }) {
  const { data } = await API.put(`/messages/${messageId}`, payload);
  return data as Message;
}

export async function deleteMessage(messageId: string) {
  const { data } = await API.delete(`/messages/${messageId}`);
  return data as { message: string };
}
