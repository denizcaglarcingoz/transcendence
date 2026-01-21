import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

type PostDto = {
  id: string
  authorName: string
  authorAvatarUrl?: string | null
  imageUrl: string
  likesCount: number
  commentsCount: number
}

async function getFeed(): Promise<PostDto[]> {
  const { data } = await api.get<PostDto[]>('/feed')
  return data
}

export function FeedPage() {
  const { data, isLoading } = useQuery({ queryKey: ['feed'], queryFn: getFeed })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        {(data ?? []).map((p) => (
          <div key={p.id} className="card overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <img
                className="h-10 w-10 rounded-full border object-cover"
                src={p.authorAvatarUrl ?? 'https://placehold.co/80x80'}
                alt=""
              />
              <div className="font-semibold">{p.authorName}</div>
            </div>

            <img className="w-full object-cover" src={p.imageUrl} alt="" />

            <div className="flex items-center gap-6 p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">♡</span>
                <span className="text-sm">{p.likesCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <span className="text-sm">{p.commentsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}