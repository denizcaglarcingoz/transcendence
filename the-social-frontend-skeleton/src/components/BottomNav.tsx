import { NavLink } from 'react-router-dom'

const Item = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex-1 text-center py-3 rounded-full ${isActive ? 'bg-white' : 'hover:bg-white/60'}`
    }
  >
    {label}
  </NavLink>
)

export function BottomNav() {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40">
      <div className="container">
        <div className="panel p-2 flex gap-2">
          <Item to="/" label="Home" />
          <Item to="/friends" label="Search" />
          <Item to="/chat" label="Chat" />
          <Item to="/profile" label="Me" />
        </div>
      </div>
    </div>
  )
}