import API from "../axios";

export interface HubContent {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function listHubContent() {
  const { data } = await API.get<HubContent[]>("/hub");
  return data;
}

export async function getHubContent(id: string) {
  const { data } = await API.get<HubContent>(`/hub/${id}`);
  return data;
}
