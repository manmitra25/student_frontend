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
export interface BestieChatResponse {
  response: string; // updated from 'reply'
  agent: string;
  crisis_detected: boolean;
  crisis_level: 'low' | 'medium' | 'high' | null;
  type: string;
  metadata?: Record<string, any>;
}

export async function bestieChat(
  message: string,
  userId?: string,
  topic?: string,
  locale?: string,
  sessionId?: string,
  history: any[] = []
): Promise<string> {
  const url = `${BASE_URL.replace(/\/$/, '')}/api/chat/ask`;

  const payload = {
    message,
    user_id: userId || "default_user",
    topic: topic || "general",
    locale: locale || "hi",
    session_id: sessionId || Date.now().toString(),
    history,
  };

  try {
    const { data } = await axios.post<BestieChatResponse>(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    console.log("Bestie API response:", data); // debug

    if (!data || typeof data.response !== 'string') {
      throw new Error('Invalid response from Bestie API');
    }

    return data.response; // <- use 'response' instead of 'reply'
  } catch (err: any) {
    console.error("Bestie API error:", err);
    throw new Error(
      err?.response?.data?.message || err?.message || 'Failed to reach Bestie API'
    );
  }
}
