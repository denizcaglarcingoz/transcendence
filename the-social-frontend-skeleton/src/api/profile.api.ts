import api from './axios'
import type { ProfileDto } from '../types/api'

export async function getMyProfile(): Promise<ProfileDto> {
  const { data } = await api.get<ProfileDto>('/profile/me')
  return data
}

export async function updateMyProfile(payload: Partial<ProfileDto>): Promise<ProfileDto> {
  const { data } = await api.put<ProfileDto>('/profile/me', payload)
  return data
}

export async function uploadAvatar(file: File): Promise<ProfileDto> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<ProfileDto>('/profile/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
