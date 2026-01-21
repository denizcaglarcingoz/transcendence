import api from './axios'
import type { ChatMessageDto } from '../types/api'

export async function getConversation(withUserId: string): Promise<ChatMessageDto[]> {
  const { data } = await api.get<ChatMessageDto[]>(`/chat/conversations/${withUserId}`)
  return data
}

export async function sendMessage(toUserId: string, content: string): Promise<void> {
  await api.post('/chat/messages', { toUserId, content })
}
