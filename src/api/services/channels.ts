import API from "../axios";

export interface Channel {
  _id: string;
  name: string;
  description?: string;
  type?: string;
  isPrivate?: boolean;
  topic?: string;
  community: string;
}

export async function getChannels(communityId: string) {
  const { data } = await API.get<Channel[]>(`/channels/community/${communityId}`);
  return data;
}
