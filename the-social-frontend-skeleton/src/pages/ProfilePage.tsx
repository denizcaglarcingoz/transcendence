import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMyProfile, useUpdateProfile, useUploadAvatar } from '../hooks/useProfile'
import { Field } from '../components/ui/Field'
import type { ProfileDto } from '../types/api'
import { useTranslation } from 'react-i18next'

export function ProfilePage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useMyProfile()
  const update = useUpdateProfile()
  const upload = useUploadAvatar()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const previewUrl = useMemo(() => (selectedFile ? URL.createObjectURL(selectedFile) : null), [selectedFile])

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Partial<ProfileDto>>()

  useEffect(() => {
    if (data) reset({ displayName: data.displayName, email: data.email })
  }, [data, reset])

  const onSave = async (values: Partial<ProfileDto>) => {
    await update.mutateAsync(values)
  }

  const onUpload = async () => {
    if (!selectedFile) return
    await upload.mutateAsync(selectedFile)
    setSelectedFile(null)
  }

  if (isLoading) return <div>{t('common.loading')}</div>
  if (error) return <div>{t('common.error')}</div>
  if (!data) return null

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Title panel */}
        <div className="panel p-8">
          <div className="text-xl tracking-widest mb-2">PROFILE</div>
          <div className="text-sm opacity-60">Manage your identity and avatar.</div>
        </div>

        {/* Avatar card */}
        <div className="card p-6">
          <div className="flex items-center gap-6">
            <img
              className="h-24 w-24 rounded-3xl object-cover border"
              src={previewUrl ?? data.avatarUrl ?? 'https://placehold.co/128x128'}
              alt="avatar"
            />

            <div className="flex-1 space-y-3">
              <div className="text-sm tracking-widest opacity-60">AVATAR</div>

              <input
                className="block w-full text-sm"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />

              <div className="flex gap-3">
                <button
                  className="btn-primary w-44"
                  onClick={onUpload}
                  disabled={!selectedFile || upload.isPending}
                  type="button"
                >
                  {upload.isPending ? '...' : t('profile.uploadAvatar')}
                </button>

                {selectedFile ? (
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => setSelectedFile(null)}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="card p-6">
          <div className="text-sm tracking-widest opacity-60 mb-4">ACCOUNT</div>

          <form className="space-y-4" onSubmit={handleSubmit(onSave)}>
            <Field label="Display name">
              <input className="input" {...register('displayName')} />
            </Field>

            <Field label="Email">
              <input className="input" {...register('email')} />
            </Field>

            <div className="flex justify-center pt-2">
              <button
                className="btn-primary w-64"
                disabled={isSubmitting || update.isPending}
                type="submit"
              >
                {update.isPending ? '...' : t('profile.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
