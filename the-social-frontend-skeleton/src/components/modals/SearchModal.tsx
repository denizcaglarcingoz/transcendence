import { useState } from 'react'
import { Modal } from '../Modal'

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')
  return (
    <Modal title="SEARCH" onClose={onClose}>
      <input className="input" placeholder="SEARCH" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-6 opacity-60 text-sm">Search results will appear here.</div>
    </Modal>
  )
}