import { Modal } from '../Modal'

export function NotificationsModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="NOTIFICATION" onClose={onClose}>
      <div className="space-y-4">
        {['liked your post · 5h', 'liked your post · 6h', 'liked your post · 7h'].map((txt, i) => (
          <div key={i} className="card p-4 flex items-center gap-4">
            <img className="h-12 w-12 rounded-full border" src="https://placehold.co/96x96" alt="" />
            <div className="font-medium">{txt}</div>
          </div>
        ))}
      </div>
    </Modal>
  )
}