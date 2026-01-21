import { http, HttpResponse } from 'msw'
import { db, requireAuth } from './db'

export const handlers = [
  // Auth
  http.post('/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Validation failed', details: { email: ['Required'], password: ['Required'] } },
        { status: 400 }
      )
    }
    return HttpResponse.json({ token: db.token })
  }),

  // Profile
  http.get('/profile/me', ({ request }) => {
    const auth = requireAuth(request)
    if (!auth.ok) return HttpResponse.json(auth.body, { status: auth.status })
    return HttpResponse.json(db.me)
  }),

  http.put('/profile/me', async ({ request }) => {
    const auth = requireAuth(request)
    if (!auth.ok) return HttpResponse.json(auth.body, { status: auth.status })

    const patch = (await request.json()) as Partial<typeof db.me>
    db.me = { ...db.me, ...patch }
    return HttpResponse.json(db.me)
  }),

  http.post('/profile/me/avatar', ({ request }) => {
    const auth = requireAuth(request)
    if (!auth.ok) return HttpResponse.json(auth.body, { status: auth.status })

    // We won’t store binary in-memory; just simulate a new URL
    db.me = { ...db.me, avatarUrl: 'https://placehold.co/128x128?text=Avatar' }
    return HttpResponse.json(db.me)
  }),

  // Friends
  http.get('/friends', ({ request }) => {
    const auth = requireAuth(request)
    if (!auth.ok) return HttpResponse.json(auth.body, { status: auth.status })
    return HttpResponse.json(db.friends)
  }),

  http.post('/friends', async ({ request }) => {
    const auth = requireAuth(request)
    if (!auth.ok) return HttpResponse.json(auth.body, { status: auth.status })

    const body = (await request.json()) as { friendId: string }
    if (!body.friendId) return HttpResponse.json({ message: 'friendId required' }, { status: 400 })

    // Create a fake friend if not exists
    if (!db.friends.find(f => f.id === body.friendId)) {
      db.friends.unshift({
        id: body.friendId,
        displayName: `User ${body.friendId.slice(0, 6)}`,
        avatarUrl: null,
        isOnline: Math.random() > 0.5,
      })
    }
    return HttpResponse.json({}, { status: 200 })
  }),

  http.delete('/friends/:friendId', ({ params, request }) => {
    const auth = requireAuth(request)
    if (!auth.ok) return HttpResponse.json(auth.body, { status: auth.status })

    const friendId = params.friendId as string
    db.friends = db.friends.filter(f => f.id !== friendId)
    return HttpResponse.json({}, { status: 200 })
  }),

  http.get('/feed', ({ request }) => {
    const auth = requireAuth(request)
    if (!auth.ok) return HttpResponse.json(auth.body, { status: auth.status })
        return HttpResponse.json([
        {
            id: 'm1',
            authorName: 'Frontend Dev',
            imageUrl: 'https://i.imgflip.com/4t0m5.jpg',
            likesCount: 1337,
            commentsCount: 42,
        },
        {
            id: 'm2',
            authorName: 'React Enjoyer',
            imageUrl: 'https://i.imgflip.com/2wifvo.jpg',
            likesCount: 9001,
            commentsCount: 256,
        },
        {
            id: 'm3',
            authorName: 'CSS Survivor',
            imageUrl: 'https://i.imgflip.com/1ihzfe.jpg',
            likesCount: 666,
            commentsCount: 13,
        },
        ])
    })
]