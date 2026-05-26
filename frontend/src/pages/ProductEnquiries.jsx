import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package2, Trash2, Eye, Search, Phone, MapPin, Inbox, Mail,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { enquiriesAPI } from '../services/api';
import ModalPortal from '../components/ui/ModalPortal';

export default function ProductEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await enquiriesAPI.list();
      if (data.success) {
        setEnquiries(data.data || []);
      } else {
        toast.error(data.message || 'Failed to load enquiries');
      }
    } catch {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      const data = await enquiriesAPI.delete(id);
      if (data.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        setShowModal(false);
        toast.success('Enquiry deleted');
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete enquiry');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const data = await enquiriesAPI.markRead(id);
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, is_read: 1 } : e))
        );
      }
    } catch {
      /* silent */
    }
  };

  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowModal(true);
    if (!enquiry.is_read) {
      handleMarkAsRead(enquiry.id);
    }
  };

  const filtered = enquiries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (e.product_name || '').toLowerCase().includes(q) ||
      (e.customer_name || '').toLowerCase().includes(q) ||
      (e.mobile_number || '').includes(q) ||
      (e.message || '').toLowerCase().includes(q) ||
      (e.address || '').toLowerCase().includes(q)
    );
  });

  const unreadCount = enquiries.filter((e) => !e.is_read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-page space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,.12)', color: '#16a34a' }}
          >
            <Package2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Product Enquiry
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Customer product enquiries from the marketing site
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Total</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{enquiries.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>New</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#16a34a' }}>{unreadCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Read</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{enquiries.length - unreadCount}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-soft)' }}
            />
            <input
              type="text"
              placeholder="Search product, customer, phone, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pl-10 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'rgba(34,197,94,.06)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Product</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Qty</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Customer</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Phone</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                    <Inbox size={40} className="mx-auto mb-2 opacity-40" />
                    No enquiries found
                  </td>
                </tr>
              ) : (
                filtered.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="border-t hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--text)' }}>
                      {enquiry.product_name}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {enquiry.quantity ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {enquiry.customer_name}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Phone size={14} /> {enquiry.mobile_number}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: enquiry.is_read ? 'var(--gray-100)' : 'rgba(34,197,94,.12)',
                          color: enquiry.is_read ? 'var(--text-muted)' : '#15803d',
                        }}
                      >
                        {enquiry.is_read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openModal(enquiry)}
                          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          style={{ color: '#2563eb' }}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(enquiry.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          style={{ color: '#dc2626' }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedEnquiry && (
        <ModalPortal>
          <>
            <div className="modal-overlay" onClick={() => setShowModal(false)} />
            <div className="modal-container">
              <div className="modal-content" style={{ maxWidth: '640px' }}>
                <div className="modal-header">
                  <h2 className="modal-title">Enquiry Details</h2>
                  <button type="button" onClick={() => setShowModal(false)} className="modal-close-btn">
                    ×
                  </button>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Product</p>
                    <p style={{ color: 'var(--text)' }}>{selectedEnquiry.product_name}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Customer</p>
                      <p style={{ color: 'var(--text)' }}>{selectedEnquiry.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Phone</p>
                      <p className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
                        <Phone size={14} /> {selectedEnquiry.mobile_number}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Address</p>
                    <p className="flex items-start gap-2" style={{ color: 'var(--text)' }}>
                      <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                      {selectedEnquiry.address || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Message</p>
                    <p className="p-3 rounded-xl" style={{ background: 'var(--gray-100)', color: 'var(--text)' }}>
                      {selectedEnquiry.message || 'No message'}
                    </p>
                  </div>
                  <p className="text-xs pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-soft)' }}>
                    <Mail size={12} className="inline mr-1" />
                    Received: {new Date(selectedEnquiry.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                    style={{ background: '#dc2626' }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        </ModalPortal>
      )}
    </motion.div>
  );
}
