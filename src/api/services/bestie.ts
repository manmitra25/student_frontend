import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BESTIE_API_URL || 'http://localhost:8000';

export interface BestieChatResponse {
  reply: string;
  // optionally, the API could return structured fields in future
  // type?: 'text' | 'assessment' | 'resource' | 'crisis';
  // metadata?: Record<string, any>;
}

/**
 * Sends a message to the FastAPI Bestie chatbot and returns the assistant's reply.
 * Expected FastAPI endpoint (adjust if your API differs):
 *   POST <BASE_URL>/chat  { message: string, user_id?: string }
 * Returns: { reply: string }
 */
export async function bestieChat(message: string, userId?: string): Promise<string> {
  const url = `${BASE_URL.replace(/\/$/, '')}/chat`;
  const payload: Record<string, any> = { message };
  if (userId) payload.user_id = userId;

  try {
    const { data } = await axios.post<BestieChatResponse>(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
    if (!data || typeof data.reply !== 'string') {
      throw new Error('Invalid response from Bestie API');
    }
    return data.reply;
  } catch (err: any) {
    // Surface a generic error; caller can decide on a fallback message
    throw new Error(err?.response?.data?.message || err?.message || 'Failed to reach Bestie API');
  }
}
