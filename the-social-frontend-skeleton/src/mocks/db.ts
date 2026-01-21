export type User = {
  id: string
  email: string
  displayName: string
  avatarUrl?: string | null
}

export type Friend = {
  id: string
  displayName: string
  avatarUrl?: string | null
  isOnline?: boolean
}

export type ChatMessage = {
  id: string
  fromUserId: string
  toUserId: string
  content: string
  sentAt: string
}

export const db: {
  token: string
  me: User
  friends: Friend[]
  chat: Map<string, ChatMessage[]>
} = {
  token: 'mock-jwt-token',
  me: {
    id: 'u-me',
    email: 'micha@mail.com',
    displayName: 'Micha',
    avatarUrl: null,
  },
  friends: [ /* ... */ ],
  chat: new Map(),
}

export function requireAuth(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return { ok: false, status: 401, body: { message: 'Unauthorized' } }
  }
  return { ok: true as const }
}