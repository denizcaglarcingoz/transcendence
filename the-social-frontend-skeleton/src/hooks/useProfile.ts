import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyProfile, updateMyProfile, uploadAvatar } from '../api/profile.api'
import type { ProfileDto } from '../types/api'

export function useMyProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMyProfile,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Partial<ProfileDto>) => updateMyProfile(p),
    onSuccess: (data) => {
      qc.setQueryData(['profile', 'me'], data)
    },
  })
}

export function useUploadAvatar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (data) => {
      qc.setQueryData(['profile', 'me'], data)
    },
  })
}
