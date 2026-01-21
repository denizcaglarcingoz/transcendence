export type ApiError = {
  message: string
  details?: Record<string, string[]>
}

export type LoginRequest = { email: string; password: string }
export type LoginResponse = { token: string }

export type ProfileDto = {
  id: string
  displayName: string
  email: string
  avatarUrl?: string | null
}

export type FriendDto = {
  id: string
  displayName: string
  avatarUrl?: string | null
  isOnline?: boolean
}

export type ChatMessageDto = {
  id: string
  fromUserId: string
  toUserId: string
  content: string
  sentAt: string
}
