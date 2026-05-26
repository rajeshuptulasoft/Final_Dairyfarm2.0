import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Centered admin modal — always rendered on document.body.
 * Never put maxWidth on the outer container; only on the inner panel.
 */
export default function AdminModal({
  open,
  onClose,
  title,
  children,
  maxWidth = '800px',
}) {
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div className="modal-overlay" onClick={onClose} aria-hidden="true" />
      <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <div className="modal-content" style={{ maxWidth }}>
          {title && (
            <div className="modal-header">
              <h2 id="admin-modal-title" className="modal-title">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}
