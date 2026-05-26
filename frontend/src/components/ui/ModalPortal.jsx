import { createPortal } from 'react-dom';

/**
 * Renders modals on document.body so they stay centered on screen
 * (not clipped by admin sidebar / main scroll areas).
 */
export default function ModalPortal({ children }) {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}
