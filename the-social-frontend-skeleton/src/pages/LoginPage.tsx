import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { LoginRequest } from '../types/api'
import { Field } from '../components/ui/Field'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const nav = useNavigate()
  const location = useLocation() as any
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginRequest) => {
    setApiError(null)
    console.log('LOGIN submit values:', values)

    try {
      await login(values)

      const token = localStorage.getItem('the-social.jwt')
      console.log('LOGIN token saved:', token)

      const to = location?.state?.from ?? '/profile'
      nav(to)
    } catch (e: any) {
      console.error('LOGIN failed:', e)
      setApiError(e?.response?.data?.message ?? 'Login failed')
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center text-sm tracking-widest opacity-70">THE SOCIAL</div>

        <div className="panel p-10">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              className="input"
              placeholder="Email"
              {...register('email', { required: true })}
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              {...register('password', { required: true })}
            />

            {apiError ? <div className="text-sm text-red-600">{apiError}</div> : null}

            <div className="flex justify-center pt-2">
              <button className="btn-primary w-64" type="submit" disabled={isSubmitting}>
                {isSubmitting ? '...' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        <div className="panel p-10">
          <button className="btn-ghost w-full flex items-center justify-center gap-3">
            <span className="text-lg">G</span>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4 opacity-60">
            <div className="h-px flex-1 bg-black/10" />
            <div className="text-xs">OR</div>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="space-y-4">
            <input className="input" placeholder="Email" />
            <input className="input" placeholder="Password" type="password" />
            <input className="input" placeholder="Full name" />
            <input className="input" placeholder="Username" />
            <div className="flex justify-center pt-2">
              <button className="btn-primary w-64">Signup</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
