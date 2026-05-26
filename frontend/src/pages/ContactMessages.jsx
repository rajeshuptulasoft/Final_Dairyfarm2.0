import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Trash2, Eye, Search, Phone, MapPin, Inbox, MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { contactMessagesAPI } from '../services/api';
import ModalPortal from '../components/ui/ModalPortal';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await contactMessagesAPI.list();
      if (data.success) {
        setMessages(data.data || []);
      } else {
        toast.error(data.message || 'Failed to load messages');
      }
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      const data = await contactMessagesAPI.delete(id);
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setShowModal(false);
        toast.success('Message deleted');
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const data = await contactMessagesAPI.markRead(id);
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m))
        );
      }
    } catch {
      /* silent */
    }
  };

  const openModal = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  const filtered = messages.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.mobile_number || '').includes(q) ||
      (m.address || '').toLowerCase().includes(q) ||
      (m.message || '').toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

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
            style={{ background: 'rgba(14,165,233,.12)', color: '#0284c7' }}
          >
            <MessageCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Contact Us
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Messages submitted through the website contact form
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Total</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{messages.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>New</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#0284c7' }}>{unreadCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Read</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>{messages.length - unreadCount}</p>
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
              placeholder="Search name, email, phone, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pl-10 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'rgba(14,165,233,.06)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Phone</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-sky-500 rounded-full mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                    <Inbox size={40} className="mx-auto mb-2 opacity-40" />
                    No contact messages found
                  </td>
                </tr>
              ) : (
                filtered.map((message) => (
                  <tr
                    key={message.id}
                    className="border-t hover:bg-black/[.02] dark:hover:bg-white/[.02]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--text)' }}>
                      {message.name}
                    </td>
                    <td className="px-4 py-3 text-sm truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
                      {message.email}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Phone size={14} /> {message.mobile_number}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(message.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: message.is_read ? 'var(--gray-100)' : 'rgba(14,165,233,.12)',
                          color: message.is_read ? 'var(--text-muted)' : '#0369a1',
                        }}
                      >
                        {message.is_read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openModal(message)}
                          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          style={{ color: '#2563eb' }}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(message.id)}
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

      {showModal && selectedMessage && (
        <ModalPortal>
          <>
            <div className="modal-overlay" onClick={() => setShowModal(false)} />
            <div className="modal-container">
              <div className="modal-content" style={{ maxWidth: '640px' }}>
                <div className="modal-header">
                  <h2 className="modal-title">Contact Message</h2>
                  <button type="button" onClick={() => setShowModal(false)} className="modal-close-btn">
                    ×
                  </button>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Name</p>
                    <p style={{ color: 'var(--text)' }}>{selectedMessage.name}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Email</p>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="hover:underline"
                        style={{ color: '#2563eb' }}
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Phone</p>
                      <a
                        href={`tel:${selectedMessage.mobile_number}`}
                        className="flex items-center gap-2 hover:underline"
                        style={{ color: '#2563eb' }}
                      >
                        <Phone size={14} /> {selectedMessage.mobile_number}
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Address</p>
                    <p className="flex items-start gap-2" style={{ color: 'var(--text)' }}>
                      <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                      {selectedMessage.address || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Message</p>
                    <p
                      className="p-3 rounded-xl whitespace-pre-wrap"
                      style={{ background: 'var(--gray-100)', color: 'var(--text)' }}
                    >
                      {selectedMessage.message}
                    </p>
                  </div>
                  <p className="text-xs pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-soft)' }}>
                    <Mail size={12} className="inline mr-1" />
                    Received: {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
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
