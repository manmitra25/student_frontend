import API from "../axios";

export interface TodoItem {
  _id: string;
  text: string;
  completed: boolean;
}

export interface ProgressSummary {
  breathingSessions?: number;
  todos?: TodoItem[];
  habits?: any[];
}

export async function addBreathingSession(contentId: string) {
  const { data } = await API.post<{ success: boolean }>(`/hub/progress/${contentId}/breathing`);
  return data;
}

export async function getTodoList(contentId: string) {
  const { data } = await API.get<{ items: TodoItem[] }>(`/hub/progress/${contentId}/todo`);
  return data;
}

export async function addTodoItem(contentId: string, text: string) {
  const { data } = await API.post<{ item: TodoItem }>(`/hub/progress/${contentId}/todo`, { text });
  return data;
}

export async function toggleTodo(contentId: string, itemId: string) {
  const { data } = await API.put<{ item: TodoItem }>(`/hub/progress/${contentId}/todo/${itemId}/toggle`);
  return data;
}

export async function createHabit(contentId: string, payload: any) {
  const { data } = await API.post(`/hub/progress/${contentId}/habits`, payload);
  return data;
}

export async function markHabitDone(contentId: string, habitId: string) {
  const { data } = await API.post(`/hub/progress/${contentId}/habits/${habitId}/done`);
  return data;
}

export async function getProgress(contentId: string) {
  const { data } = await API.get<ProgressSummary>(`/hub/progress/${contentId}/progress`);
  return data;
}
