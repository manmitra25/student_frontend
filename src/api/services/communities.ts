import API from "../axios";

export interface Community {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  rules?: string[];
  createdBy?: string;
}

export interface PaginatedCommunities {
  communities: Community[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export async function listCommunities(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  const { data } = await API.get<PaginatedCommunities>("/communities", { params });
  return data;
}

export async function getCommunity(id: string) {
  const { data } = await API.get<Community>(`/communities/${id}`);
  return data;
}

export async function joinCommunity(id: string, username: string) {
  const { data } = await API.post(`/communities/${id}/join`, { username });
  return data as { message: string; community: Community };
}

export async function leaveCommunity(communityId: string) {
  const { data } = await API.post(`/communities/${communityId}/leave`);
  return data as { message: string; community: Community };
}
