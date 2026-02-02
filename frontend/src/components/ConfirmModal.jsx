import React, { useEffect, useRef } from 'react'

const ConfirmModal = ({ open, title = 'Confirm', message = '', onConfirm, onCancel }) => {
  const confirmRef = useRef(null)
  const previousActive = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    if (open) {
      previousActive.current = document.activeElement
      setTimeout(() => confirmRef.current?.focus(), 0)
      document.addEventListener('keydown', onKey)
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previousActive.current) previousActive.current.focus()
    }
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h3 id="confirm-title" className="text-lg font-semibold mb-2">{title}</h3>
        <p id="confirm-desc" className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>Cancel</button>
          <button ref={confirmRef} className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
