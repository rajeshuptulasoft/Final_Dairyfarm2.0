import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import DailyFoodFormFields from './DailyFoodFormFields';

export default function DailyFoodModal({
  form,
  setForm,
  animals,
  fodderItems = [],
  onSubmit,
  onClose,
  saving = false,
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
        className="daily-food-form-panel daily-food-modal-panel"
        style={{ maxWidth: 920, width: '92%', maxHeight: '90vh', overflowY: 'auto', margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="daily-food-top-bar">
          <h2 className="daily-food-title-center">
            <span className="daily-food-title-icon" aria-hidden>
              🐄
            </span>
            Daily Food
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              form="daily-food-modal-form"
              disabled={saving}
              className="daily-food-save-btn"
            >
              {saving ? 'Saving...' : 'SAVE'}
            </button>
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
        </div>

        <form id="daily-food-modal-form" onSubmit={onSubmit}>
          <DailyFoodFormFields
            form={form}
            setForm={setForm}
            animals={animals}
            fodderItems={fodderItems}
          />
        </form>
      </motion.div>
    </motion.div>
  );
}
