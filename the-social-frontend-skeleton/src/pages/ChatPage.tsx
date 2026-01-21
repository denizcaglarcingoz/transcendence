import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getChatConnection, startConnection } from '../realtime/signalr'
import type { ChatMessageDto } from '../types/api'

/**
 * Minimal chat UI skeleton:
 * - Keeps messages in TanStack Query cache under ['chat', activeUserId]
 * - SignalR pushes append into cache
 *
 * Replace event names with what Person 3 implements:
 * - "MessageReceived" is a placeholder.
 */
export function ChatPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const [activeUserId, setActiveUserId] = useState('') // "who I'm chatting with"
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  const messages = (qc.getQueryData<ChatMessageDto[]>(['chat', activeUserId]) ?? [])
  const canChat = Boolean(activeUserId)

  useEffect(() => {
    const mocksOn = import.meta.env.VITE_USE_MOCKS === 'true'
    if (mocksOn) return

    const conn = getChatConnection()

    void (async () => {
      await startConnection(conn)

      conn.on('MessageReceived', (msg: ChatMessageDto) => {
        // If your backend sends roomId, use that; for now we key by activeUserId
        const key = ['chat', activeUserId]
        qc.setQueryData<ChatMessageDto[]>(key, (old) => [...(old ?? []), msg])
      })
    })()

    return () => {
      conn.off('MessageReceived')
    }
  }, [activeUserId, qc])

  useEffect(() => {
    // auto-scroll
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages.length])

  const onSend = async () => {
    if (!text.trim() || !activeUserId) return

    // Placeholder: Person 3 may implement SignalR invoke like "SendMessage"
    // or you may call REST /chat/messages and let the server broadcast.
    const conn = getChatConnection()
    await conn.invoke('SendMessage', { toUserId: activeUserId, content: text.trim() })
    setText('')
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel: conversations / select user */}
        <div className="panel p-6 md:col-span-1">
          <div className="text-xl tracking-widest mb-4">MESSAGES</div>

          <label className="text-sm opacity-70">Chat with userId</label>
          <input
            className="input mt-2"
            value={activeUserId}
            onChange={(e) => setActiveUserId(e.target.value)}
            placeholder="userId"
          />

          <div className="mt-6 space-y-3">
            <div className="text-sm tracking-widest opacity-60">RECENT</div>

            {/* Mock list items (until you have real conversations) */}
            {['u-deniz', 'u-daria', 'u-sam'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveUserId(id)}
                className={`w-full text-left card p-4 flex items-center gap-3 transition ${
                  activeUserId === id ? 'ring-2 ring-black/10' : 'hover:bg-black/5'
                }`}
              >
                <img className="h-12 w-12 rounded-full border" src="https://placehold.co/96x96" alt="" />
                <div className="min-w-0">
                  <div className="font-semibold truncate">{id}</div>
                  <div className="text-sm opacity-60 truncate">Tap to open chat…</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right panel: chat window */}
        <div className="md:col-span-2 card overflow-hidden">
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <div>
              <div className="text-sm tracking-widest opacity-60">CHAT</div>
              <div className="text-lg font-semibold">
                {activeUserId ? `@${activeUserId}` : 'Pick a conversation'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" className="btn-ghost">
                Call
              </button>
              <button type="button" className="btn-ghost">
                Info
              </button>
            </div>
          </div>

          <div ref={listRef} className="h-[28rem] overflow-auto p-6 space-y-3 bg-neutral-50">
            {!canChat ? (
              <div className="opacity-60">Select a user on the left to start chatting.</div>
            ) : (
              messages.map((m) => {
                // Simple alignment: if you have m.fromUserId you can improve this
                const isMine = m.fromUserId === 'u-me'
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-3xl border bg-white`}>
                      <div className="text-xs opacity-60 mb-1">
                        {new Date(m.sentAt).toLocaleString()}
                      </div>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="p-6 border-t border-black/5 flex gap-3 bg-white">
            <input
              className="input"
              placeholder={t('chat.placeholder')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!canChat}
            />
            <button
              className="btn-primary w-36"
              onClick={onSend}
              disabled={!canChat || !text.trim()}
              type="button"
            >
              {t('chat.send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
