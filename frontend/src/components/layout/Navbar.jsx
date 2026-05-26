import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationsAPI } from '../../services/api';
import { Bell, Moon, Sun, LogOut, Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_TITLES = {
  '/muktifarm/admin': { title: 'Dashboard', subtitle: 'Farm overview & metrics' },
  '/muktifarm/admin/animals': { title: 'Animals', subtitle: 'Manage livestock' },
  '/muktifarm/admin/animals/register': { title: 'Register Animal', subtitle: 'Add new animal' },
  '/muktifarm/admin/animals/daily-food': { title: 'Daily Food', subtitle: 'Record feed for cows' },
  '/muktifarm/admin/animals/daily-milk': { title: 'Daily Milk', subtitle: 'Milk production log' },
  '/muktifarm/admin/animals/heat': { title: 'Heat', subtitle: 'Heat cycle tracking' },
  '/muktifarm/admin/animals/catalogue': { title: 'Catalogue', subtitle: 'Animal catalogue' },
  '/muktifarm/admin/health': { title: 'Health Care', subtitle: 'Health & veterinary' },
  '/muktifarm/admin/health/log': { title: 'Health Log', subtitle: 'Health records' },
  '/muktifarm/admin/enquiry': { title: 'Enquiry', subtitle: 'Product enquiries' },
  '/muktifarm/admin/contact-us': { title: 'Contact Us', subtitle: 'Contact messages' },
  '/muktifarm/admin/settings': { title: 'Settings', subtitle: 'System configuration' },
};

function resolvePageMeta(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES)
    .filter((p) => p !== '/muktifarm/admin')
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname.startsWith(p));
  if (match) return PAGE_TITLES[match];
  const segment = pathname.split('/').filter(Boolean).pop() || 'Admin';
  const title = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { title, subtitle: 'DairyFarm Admin' };
}

export default function Navbar({ setMobileOpen }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [showUser, setShowUser] = useState(false);

  const pageMeta = useMemo(
    () => resolvePageMeta(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    notificationsAPI.list().then(res => {
      setUnread(res.data.unreadCount);
      setNotifs(res.data.unread);
    }).catch(() => {});
    const t = setInterval(() => {
      notificationsAPI.list().then(res => {
        setUnread(res.data.unreadCount);
        setNotifs(res.data.unread);
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => { logout(); navigate('/muktifarm/admin/login'); };

  return (
    <header className="admin-header sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700">
      <div className="admin-header-inner">
        <div className="admin-header-left">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="admin-header-titles min-w-0">
            <h1 className="admin-header-title">{pageMeta.title}</h1>
            <p className="admin-header-subtitle">{pageMeta.subtitle}</p>
          </div>
        </div>

        <div className="admin-header-right">
          <div className="admin-header-user flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <User size={16} className="text-primary-600" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {user?.name || 'Admin User'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
            {showNotif && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700 font-semibold text-sm text-gray-900 dark:text-white">
                    Notifications
                  </div>
                  <div className="max-h-80 overflow-y-auto admin-scroll-hidden">
                    {notifs.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">All clear!</div>
                    ) : notifs.slice(0, 5).map(n => (
                      <div key={n.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700/50">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUser(!showUser)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <User size={16} className="text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100 hidden sm:block">
                {user?.name || 'User'}
              </span>
            </button>
            {showUser && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUser(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
