import API from "../axios";

export interface ChatStartResponse { success: boolean; sessionId: string }
export interface ChatHistoryItem { role: string; message: string }

export async function startChat(studentId: string) {
  const { data } = await API.post<ChatStartResponse>("/chat/start", { studentId });
  return data;
}

export async function sendChatMessage(message: string) {
  const { data } = await API.post<{ success: boolean; chatHistory: ChatHistoryItem[] }>("/chat/message", { message });
  return data;
}

export async function giveChatConsent() {
  const { data } = await API.post<{ success: boolean; message: string }>("/chat/consent");
  return data;
}

export async function endChat() {
  const { data } = await API.post<{ success: boolean; message: string }>("/chat/end");
  return data;
}
