import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Beef, Milk, Apple, Syringe, Heart, Activity,
  DollarSign, FileText, Users, Settings, ChevronLeft,
  X, Flower2, ChevronDown, Plus, Calendar, Thermometer, Book,
  Mail, MessageCircle
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { path: '/muktifarm/admin', icon: LayoutDashboard, label: 'Dashboard', color: 'text-emerald-500' },
  { path: '/muktifarm/admin/animals', icon: Beef, label: 'Animals', color: 'text-amber-500',
    children: [
      { path: '/muktifarm/admin/animals', label: 'All Animals' },
      { path: '/muktifarm/admin/animals/register', label: 'Register', icon: Plus },
      { path: '/muktifarm/admin/animals/daily-food', label: 'Daily Food', icon: Apple },
      { path: '/muktifarm/admin/animals/daily-milk', label: 'Daily Milk', icon: Milk },
      { path: '/muktifarm/admin/animals/heat', label: 'Heat', icon: Thermometer },
      { path: '/muktifarm/admin/animals/catalogue', label: 'Catalogue', icon: Book },
    ]
  },
  {
    path: '/muktifarm/admin/milk', icon: Milk, label: 'Stock', color: 'text-blue-500',
    children: [
      { path: '/muktifarm/admin/milk/entry', label: 'Entry', icon: Plus },
      { path: '/muktifarm/admin/milk/view', label: 'View', icon: FileText },
      { path: '/muktifarm/admin/milk/products-log', label: 'Products Log', icon: Book },
      { path: '/muktifarm/admin/milk/donations-log', label: 'Donations Log', icon: DollarSign },
    ]
  },
  {
    path: '/muktifarm/admin/health', icon: Activity, label: 'Health Care', color: 'text-red-500',
    children: [
      { path: '/muktifarm/admin/health/log', label: 'Health Log', icon: Activity },
      { path: '/muktifarm/admin/breeding', label: 'Breeding', icon: Heart },
      { path: '/muktifarm/admin/health/pregnancy', label: 'Pregnancy', icon: Calendar },
      { path: '/muktifarm/admin/health/calved', label: 'Calved', icon: Book },
    ]
  },
  { path: '/muktifarm/admin/vaccinations', icon: Syringe, label: 'Purchase', color: 'text-purple-500' },
  { path: '/muktifarm/admin/sales', icon: DollarSign, label: 'Sales', color: 'text-emerald-500' },
  {
    path: '/muktifarm/admin/settings', icon: Settings, label: 'Settings', color: 'text-slate-500',
    children: [
      { path: '/muktifarm/admin/settings/items', label: 'Items', icon: FileText },
      { path: '/muktifarm/admin/settings/livestocks', label: 'Livestocks', icon: FileText },
      { path: '/muktifarm/admin/settings/products', label: 'Products', icon: FileText },
      { path: '/muktifarm/admin/settings/fodder', label: 'Fodder', icon: FileText },
      { path: '/muktifarm/admin/settings/buyers', label: 'Buyers', icon: FileText },
      { path: '/muktifarm/admin/settings/vendors', label: 'Vendors', icon: FileText },
      { path: '/muktifarm/admin/settings/doctors', label: 'Doctors', icon: FileText },
    ]
  },
  { path: '/muktifarm/admin/expenses', icon: DollarSign, label: 'Expenses', color: 'text-orange-500' },
  { path: '/muktifarm/admin/reports', icon: FileText, label: 'Reports', color: 'text-indigo-500' },
  { path: '/muktifarm/admin/employees', icon: Users, label: 'Employees', color: 'text-cyan-500' },
  { path: '/muktifarm/admin/enquiry', icon: MessageCircle, label: 'Enquiry', color: 'text-green-500' },
  { path: '/muktifarm/admin/contact-us', icon: Mail, label: 'Contact Us', color: 'text-blue-500' },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const isChildActive = (children) => children?.some(c => location.pathname === c.path);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const closeMobile = () => { if (window.innerWidth < 1024) setMobileOpen(false); };
  const baseLinkClass = 'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 sidebar-link-base';
  const activeLinkClass = 'sidebar-link-active';

  return (
      <aside
        className={[
          'admin-sidebar sidebar-bg border-r border-gray-200 dark:border-gray-700 flex flex-col',
          collapsed ? 'admin-sidebar--collapsed' : '',
          mobileOpen ? 'admin-sidebar--open' : '',
        ].join(' ')}
      >
        <div className="admin-sidebar-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <Flower2 className="w-7 h-7 text-primary-600 flex-shrink-0" />
              <span className="sidebar-logo-text truncate">Dairy<span className="sidebar-logo-accent">Farm</span></span>
            </div>
          )}
          {collapsed && <Flower2 className="w-7 h-7 text-primary-600 mx-auto" />}
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) setMobileOpen(false);
              else setCollapsed(!collapsed);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 flex-shrink-0"
          >
            {mobileOpen ? (
              <X size={18} className="lg:hidden" />
            ) : (
              <ChevronLeft size={18} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>

        <nav className="admin-sidebar-nav space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.label;
            const childActive = isChildActive(item.children);

            if (hasChildren) {
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!collapsed) toggleDropdown(item.label);
                      else { closeMobile(); window.location.href = item.path; }
                    }}
                    className={`${baseLinkClass} w-full ${childActive || location.pathname === item.path ? activeLinkClass : ''}`}
                  >
                    <Icon size={20} className={collapsed ? 'mx-auto' : 'flex-shrink-0'} />
                    {!collapsed && (
                      <>
                        <span className="text-sm flex-1 text-left">{item.label}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {!collapsed && isOpen && (
                    <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                      {item.children.map(child => {
                        const ChildIcon = child.icon || null;
                        const isChildRoute = location.pathname === child.path;
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            end
                            onClick={closeMobile}
                            className={`${baseLinkClass} text-sm ${isChildRoute ? activeLinkClass : ''}`}
                          >
                            {ChildIcon && <ChildIcon size={15} />}
                            <span>{child.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/muktifarm/admin'}
                onClick={closeMobile}
                className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={`${collapsed ? 'mx-auto' : 'flex-shrink-0'} ${isActive ? item.color : ''}`} />
                    {!collapsed && <span className="text-sm">{item.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

      </aside>
  );
}
