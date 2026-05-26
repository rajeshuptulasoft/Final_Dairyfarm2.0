import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
