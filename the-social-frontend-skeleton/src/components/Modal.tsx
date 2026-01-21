export function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/20">
      <div className="panel w-full max-w-3xl p-6 relative">
        <button className="absolute right-6 top-6 text-2xl" onClick={onClose}>
          ×
        </button>
        <div className="text-xl tracking-widest mb-4">{title}</div>
        {children}
      </div>
    </div>
  )
}