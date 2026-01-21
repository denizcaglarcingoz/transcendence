import { Modal } from '../Modal'

export function LikesModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="LIKES" onClose={onClose}>
      <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img className="h-12 w-12 rounded-full border" src="https://placehold.co/96x96" alt="" />
              <div>
                <div className="font-semibold">User {i + 1}</div>
                <div className="text-sm opacity-60">@user_{i + 1}</div>
              </div>
            </div>
            <button className="btn-ghost">Following</button>
          </div>
        ))}
      </div>
    </Modal>
  )
}