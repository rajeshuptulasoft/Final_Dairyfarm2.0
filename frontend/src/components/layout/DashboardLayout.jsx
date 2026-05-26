import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { enhanceAdminTables } from '../../utils/mobileTableCards';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const tableEnhanceTimer = useRef(null);

  useEffect(() => {
    const center = document.querySelector('.admin-page-center');
    if (!center) return;

    const run = () => {
      if (tableEnhanceTimer.current) clearTimeout(tableEnhanceTimer.current);
      tableEnhanceTimer.current = setTimeout(() => enhanceAdminTables(center), 60);
    };

    run();
    const observer = new MutationObserver(run);
    observer.observe(center, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (tableEnhanceTimer.current) clearTimeout(tableEnhanceTimer.current);
    };
  }, [location.pathname]);

  return (
    <div
      className={`admin-shell bg-gray-50 dark:bg-gray-900 ${collapsed ? 'admin-shell--collapsed' : ''}`}
    >
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div className="admin-sidebar-column">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      <div className="admin-content">
        <Navbar setMobileOpen={setMobileOpen} />
        <main className="admin-main">
          <div className="admin-page-center">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
