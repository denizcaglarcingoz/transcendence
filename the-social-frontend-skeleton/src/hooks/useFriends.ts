import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addFriendById, listFriends, removeFriendById } from '../api/friends.api'

export function useFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: listFriends,
  })
}

export function useAddFriend() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (friendId: string) => addFriendById(friendId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['friends'] }),
  })
}

export function useRemoveFriend() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (friendId: string) => removeFriendById(friendId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['friends'] }),
  })
}
