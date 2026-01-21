import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n/i18n'
import { BottomNav } from '../components/BottomNav'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm ${isActive ? 'bg-black text-white' : 'hover:bg-black/5'}`
      }
    >
      {label}
    </NavLink>
  )
}

export function Layout() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page">
      <header className="bg-white">
        <div className="container flex items-center justify-between py-6">
          <div className="text-sm tracking-widest font-semibold">THE SOCIAL</div>

          <nav className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <NavItem to="/feed" label="Feed" />
                <NavItem to="/profile" label={t('nav.profile')} />
                <NavItem to="/friends" label={t('nav.friends')} />
                <NavItem to="/chat" label={t('nav.chat')} />
                <button
                  className="btn-ghost"
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <NavItem to="/login" label="Login" />
            )}
          </nav>

          <select
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm"
            value={i18n.language}
            onChange={(e) => setLanguage(e.target.value as any)}
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="es">ES</option>
          </select>
        </div>
      </header>

      <main className="container py-8 pb-28">
        <Outlet />
      </main>
       {isAuthenticated ? <BottomNav /> : null}
    </div>
  )
}
