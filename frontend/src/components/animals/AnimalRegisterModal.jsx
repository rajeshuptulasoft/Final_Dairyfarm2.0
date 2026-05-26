import { motion } from 'framer-motion';
import { Beef, X } from 'lucide-react';
import AnimalRegisterFormFields from './AnimalRegisterFormFields';

export default function AnimalRegisterModal({
  title = 'Register',
  form,
  setForm,
  onSubmit,
  onClose,
  submitLabel = 'Register',
  saving = false,
  imagePreview = '',
  onImageSelect,
  onImageClear,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="card animal-register-modal"
        style={{ maxWidth: 720, width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Beef size={20} style={{ color: '#f59e0b' }} />
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/[.04] dark:hover:bg-white/[.04]"
            style={{ color: 'var(--text-soft)' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <AnimalRegisterFormFields
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            onImageSelect={onImageSelect}
            onImageClear={onImageClear}
          />
          <div className="flex gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving...' : submitLabel}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
