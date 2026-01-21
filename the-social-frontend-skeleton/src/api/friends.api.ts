import api from './axios'
import type { FriendDto } from '../types/api'

export async function listFriends(): Promise<FriendDto[]> {
  const { data } = await api.get<FriendDto[]>('/friends')
  return data
}

export async function addFriendById(friendId: string): Promise<void> {
  await api.post('/friends', { friendId })
}

export async function removeFriendById(friendId: string): Promise<void> {
  await api.delete(`/friends/${friendId}`)
}
