import { useState } from 'react'
import { useAddFriend, useFriends, useRemoveFriend } from '../hooks/useFriends'
import { useTranslation } from 'react-i18next'

export function FriendsPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useFriends()
  console.log('friends data typeof:', typeof data, 'isArray:', Array.isArray(data), data)
  const add = useAddFriend()
  const remove = useRemoveFriend()
  const [friendId, setFriendId] = useState('')

  if (isLoading) return <div>{t('common.loading')}</div>
  if (error) return <div>{t('common.error')}</div>

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="panel p-8">
          <div className="text-xl tracking-widest mb-6">FRIENDS</div>

          <div className="flex gap-2">
            <input className="input" placeholder="Friend userId" value={friendId} onChange={(e) => setFriendId(e.target.value)} />
            <button className="btn-primary w-36" disabled={!friendId || add.isPending} onClick={() => add.mutate(friendId)}>
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {(Array.isArray(data) ? data : []).map((f) => (
            <div key={f.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img className="h-12 w-12 rounded-full border object-cover" src={f.avatarUrl ?? 'https://placehold.co/96x96'} alt="" />
                <div>
                  <div className="font-semibold">{f.displayName}</div>
                  <div className="text-sm opacity-60">
                    {f.isOnline ? t('friends.online') : t('friends.offline')}
                  </div>
                </div>
              </div>

              <button className="btn-ghost" disabled={remove.isPending} onClick={() => remove.mutate(f.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
