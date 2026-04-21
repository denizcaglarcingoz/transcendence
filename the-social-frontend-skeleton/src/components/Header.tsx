import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useTranslation } from 'react-i18next'
import { useRealtime } from '../realtime/RealtimeProvider'
import { getConversations, type ConversationDto } from '../api/chat.api'

interface HeaderProps {
  showNotification?: boolean
}

type FriendshipRequestDto = {
  id: string
  requesterId: string
  targetUserId: string
  createdAt: string
}

type NotificationType = 1 | 2 | 3 | 4 | 5

type ChatMessageDto = {
  messageId: string
  clientMessageId?: string
  conversationId: string
  senderId: string
  isReadByUser: boolean
  content: string
  isReadByOthers: boolean
  createdAt: string
}

type NotificationDto = {
  id: string
  type: NotificationType
  payload: ChatMessageDto
  createdAt: string
}

function playSystemBeep() {
  try {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = 880
    gain.gain.value = 0.05

    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    oscillator.start()

    setTimeout(() => {
      oscillator.stop()
      void audioContext.close()
    }, 120)
  } catch (err) {
    console.error('Failed to play sound', err)
  }
}

export function Header({ showNotification = true }: HeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [friendRequestCount, setFriendRequestCount] = useState(0)

  const { t } = useTranslation()
  const { user } = useAuth()
  const { connection, isConnected } = useRealtime()

  const currentUserId = user?.id ?? null

  async function loadHeaderSummary() {
    if (!currentUserId) return

    try {
      const conversations: ConversationDto[] = await getConversations(currentUserId)

      const unreadMessages = conversations.reduce(
        (sum, item) => sum + (item.unreadCount ?? 0),
        0
      )

      setUnreadCount(unreadMessages)

      // временно friend requests = 0
      // потом сюда добавишь запрос на friendship requests count
      setFriendRequestCount(0)
    } catch (err) {
      console.error('Failed to load header summary', err)
    }
  }

  useEffect(() => {
    if (!currentUserId) return
    void loadHeaderSummary()
  }, [currentUserId])

  useEffect(() => {
    if (!connection || !currentUserId || !isConnected) return

    const handleNotificationReceived = (notification: NotificationDto) => {
      const isMyOwnMessage = notification.payload.senderId === currentUserId
      if (isMyOwnMessage) return

      playSystemBeep()
      void loadHeaderSummary()
    }

    const handleConversationsChanged = () => {
      void loadHeaderSummary()
    }

    const handleFriendshipRequestReceived = (_request: FriendshipRequestDto) => {
      playSystemBeep()
      void loadHeaderSummary()
    }

    connection.on('NotificationReceived', handleNotificationReceived)
    connection.on('ConversationsChanged', handleConversationsChanged)
    connection.on('FriendshipRequestReceived', handleFriendshipRequestReceived)

    return () => {
      connection.off('NotificationReceived', handleNotificationReceived)
      connection.off('ConversationsChanged', handleConversationsChanged)
      connection.off('FriendshipRequestReceived', handleFriendshipRequestReceived)
    }
  }, [connection, currentUserId, isConnected])

  const totalNotifications = unreadCount + friendRequestCount
  const hasNotifications = totalNotifications > 0

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 flex items-center justify-between">
        <NavLink to="/feed">
          <TheSocialLogo className="h-4 w-auto text-gray-900" />
        </NavLink>

        <div className="flex items-center gap-3">
          {showNotification && (
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <BellIcon className="w-6 h-6 text-gray-700" />
              {hasNotifications && (
                <>
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {totalNotifications > 99 ? '99+' : totalNotifications}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}