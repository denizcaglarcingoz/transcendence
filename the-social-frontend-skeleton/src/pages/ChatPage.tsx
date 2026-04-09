import { useEffect, useRef, useState } from 'react'
import type { HubConnection } from '@microsoft/signalr'
import { useAuth } from '../auth/AuthContext'
import {
  createChatConnection,
  createDirectConversation,
  getConversations,
  getMessages,
  joinConversation,
  leaveConversation,
  markAsRead,
  sendMessage,
  startConnection,
  type ChatMessageDto,
  type ConversationDto,
  type MessageAckDto,
  type MessageDeliveredDto,
  type MessageReadDto,
} from '../api/chat.api'

export function ChatPage() {
  const { user } = useAuth()
  const currentUserId = user?.id ?? null

  console.log('CHAT user', user)
  console.log('CHAT currentUserId', currentUserId)

  const [conversations, setConversations] = useState<ConversationDto[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loadingChats, setLoadingChats] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [creatingDirect, setCreatingDirect] = useState(false)
  const [targetUserIdInput, setTargetUserIdInput] = useState('')

  const connectionRef = useRef<HubConnection | null>(null)
  const activeConversationIdRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  async function loadConversations() {
    if (!currentUserId) return []

    setLoadingChats(true)
    setError(null)

    try {
      const data = await getConversations(currentUserId)
      setConversations(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
      return []
    } finally {
      setLoadingChats(false)
    }
  }

  async function loadConversationMessages(conversationId: string) {
    if (!currentUserId) return

    setLoadingMessages(true)
    setError(null)

    try {
      const data = await getMessages(currentUserId, conversationId)
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoadingMessages(false)
    }
  }

  async function openConversation(conversationId: string) {
    try {
      if (!connectionRef.current) {
        throw new Error('Chat connection is not initialized')
      }

      if (
        activeConversationIdRef.current &&
        activeConversationIdRef.current !== conversationId
      ) {
        await leaveConversation(connectionRef.current, activeConversationIdRef.current)
      }

      await joinConversation(connectionRef.current, conversationId)

      activeConversationIdRef.current = conversationId
      setActiveConversationId(conversationId)

      await loadConversationMessages(conversationId)
      await markAsRead(connectionRef.current, conversationId)
      await loadConversations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open conversation')
    }
  }

  async function handleCreateDirectConversation() {
    if (!currentUserId) return

    const targetUserId = targetUserIdInput.trim()
    if (!targetUserId) return

    setCreatingDirect(true)
    setError(null)

    try {
      const conversationId = await createDirectConversation(currentUserId, targetUserId)
      await loadConversations()
      await openConversation(conversationId)
      setTargetUserIdInput('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create direct conversation')
    } finally {
      setCreatingDirect(false)
    }
  }

  async function setupSignalR() {
    if (!currentUserId) return

    const connection = createChatConnection(currentUserId)
    connectionRef.current = connection

    connection.on('MessageReceived', (message: ChatMessageDto) => {
      console.log('MessageReceived', message)

      if (message.conversationId === activeConversationIdRef.current) {
        setMessages(prev => {
          const exists = prev.some(item => item.messageId === message.messageId)
          if (exists) return prev
          return [...prev, message]
        })
      }

      void loadConversations()
    })

    connection.on('MessageAck', (ack: MessageAckDto) => {
      console.log('MessageAck', ack)
    })

    connection.on('MessageDelivered', (payload: MessageDeliveredDto) => {
      console.log('MessageDelivered', payload)
    })

    connection.on('MessageRead', (payload: MessageReadDto) => {
      console.log('MessageRead', payload)

      if (payload.conversationId === activeConversationIdRef.current) {
        setMessages(prev =>
          prev.map(item =>
            item.messageId === payload.messageId
              ? { ...item, isReadByOthers: true }
              : item
          )
        )
      }
    })

    connection.on('OnlineUsersSnapshot', (users: string[]) => {
      console.log('OnlineUsersSnapshot', users)
    })

    connection.on('UserOnLine', payload => {
      console.log('UserOnLine', payload)
    })

    connection.on('UserOffLine', payload => {
      console.log('UserOffLine', payload)
    })

    await startConnection(connection)
  }

  async function handleSend() {
    if (!connectionRef.current) return
    if (!activeConversationId) return
    if (!text.trim()) return

    setSending(true)
    setError(null)

    try {
      await sendMessage(connectionRef.current, {
        conversationId: activeConversationId,
        clientMessageId: crypto.randomUUID(),
        content: text.trim(),
      })

      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (!currentUserId) return

    let isMounted = true

    async function init() {
      try {
        await setupSignalR()
        if (!isMounted) return

        const list = await loadConversations()
        if (!isMounted) return

        if (list.length > 0) {
          await openConversation(list[0].id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize chat')
      }
    }

    void init()

    return () => {
      isMounted = false
      if (connectionRef.current) {
        void connectionRef.current.stop()
      }
    }
  }, [currentUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside
        style={{
          width: '320px',
          borderRight: '1px solid #ddd',
          padding: '16px',
          overflowY: 'auto',
        }}
      >
        <h2>Chats</h2>
        <p>User: {currentUserId ?? 'Not loaded'}</p>

        <button onClick={() => void loadConversations()} disabled={loadingChats || !currentUserId}>
          {loadingChats ? 'Refreshing...' : 'Refresh chats'}
        </button>

        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <input
            value={targetUserIdInput}
            onChange={e => setTargetUserIdInput(e.target.value)}
            placeholder="Target user id"
            style={{ padding: '10px' }}
          />
          <button
            onClick={() => void handleCreateDirectConversation()}
            disabled={creatingDirect || !targetUserIdInput.trim() || !currentUserId}
          >
            {creatingDirect ? 'Creating...' : 'Create direct chat'}
          </button>
        </div>

        {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}

        <div style={{ marginTop: '16px' }}>
          {conversations.map(conversation => (
            <button
              key={conversation.id}
              onClick={() => void openConversation(conversation.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                marginBottom: '8px',
                padding: '12px',
                border:
                  conversation.id === activeConversationId
                    ? '2px solid black'
                    : '1px solid #ccc',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                {conversation.targetUserName}
              </div>

              <div style={{ fontSize: '13px', color: '#555' }}>
                {conversation.lastMessage || 'No messages yet'}
              </div>

              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                unread: {conversation.unreadCount}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            background: '#fafafa',
          }}
        >
          {!activeConversationId && <p>Select a conversation</p>}
          {loadingMessages && <p>Loading messages...</p>}

          {!loadingMessages &&
            messages.map(message => {
              const isMine = message.senderId === currentUserId

              return (
                <div
                  key={message.messageId}
                  style={{
                    display: 'flex',
                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      background: 'white',
                    }}
                  >
                    <div>{message.content}</div>

                    <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                      {new Date(message.createdAt).toLocaleString()}
                    </div>

                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                      {message.isReadByOthers ? 'Read' : 'Sent'}
                    </div>
                  </div>
                </div>
              )
            })}

          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #ddd',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '10px' }}
          />
          <button
            onClick={() => void handleSend()}
            disabled={sending || !text.trim() || !currentUserId}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </main>
    </div>
  )
}