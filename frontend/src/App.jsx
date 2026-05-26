import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import RegisterAnimal from './pages/RegisterAnimal';
import DailyFood from './pages/DailyFood';
import DailyMilk from './pages/DailyMilk';
import Heat from './pages/Heat';
import Catalogue from './pages/Catalogue';
import Milk from './pages/Milk';
import Vaccinations from './pages/Vaccinations';
import Breeding from './pages/Breeding';
import Health from './pages/Health';
import Pregnancy from './pages/Pregnancy';
import Calved from './pages/Calved';
import Sales from './pages/Sales';
import Settings from './pages/Settings';
import Items from './pages/Items';
import Livestocks from './pages/Livestocks';
import Products from './pages/Products';
import Fodder from './pages/Fodder';
import Buyers from './pages/Buyers';
import Vendors from './pages/Vendors';
import Doctors from './pages/Doctors';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import ProductEnquiries from './pages/ProductEnquiries';
import ContactMessages from './pages/ContactMessages';

// Marketing Pages
import MarketingHome from './muktifarm/src/pages/Home';
import MarketingProducts from './muktifarm/src/pages/Products';
import MarketingAbout from './muktifarm/src/pages/About';
import MarketingContact from './muktifarm/src/pages/Contact';
import MarketingNavbar from './muktifarm/src/components/Navbar';
import MarketingFooter from './muktifarm/src/components/Footer';

import './muktifarm/src/css/global.css';
import './muktifarm/src/css/footer.css';
import './muktifarm/src/css/marketing-responsive.css';

function MarketingPage({ children }) {
  return (
    <div className="marketing-layout" id="top">
      <MarketingNavbar />
      <main className="marketing-main">{children}</main>
      <MarketingFooter />
      <a
        href="#top"
        className="back-top show"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Back to top"
      >
        <i className="bi bi-arrow-up" />
      </a>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  return user ? children : <Navigate to="/muktifarm/admin/login" />;
}

function LegacyAdminRedirect() {
  const location = useLocation();
  return <Navigate to={`/muktifarm/admin${location.pathname}${location.search}`} replace />;
}

const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const router = createBrowserRouter([
  { path: '/login', element: <Navigate to='/muktifarm/admin/login' replace /> },
  { path: '/admin', element: <Navigate to='/muktifarm/admin' replace /> },
  { path: '/milk/*', element: <LegacyAdminRedirect /> },
  { path: '/animals/*', element: <LegacyAdminRedirect /> },
  { path: '/health/*', element: <LegacyAdminRedirect /> },
  { path: '/vaccinations/*', element: <LegacyAdminRedirect /> },
  { path: '/sales/*', element: <LegacyAdminRedirect /> },
  { path: '/settings/*', element: <LegacyAdminRedirect /> },
  { path: '/breeding', element: <LegacyAdminRedirect /> },
  { path: '/expenses', element: <LegacyAdminRedirect /> },
  { path: '/reports', element: <LegacyAdminRedirect /> },
  { path: '/employees', element: <LegacyAdminRedirect /> },
  { path: '/muktifarm/admin/login', element: <Login /> },
  {
    path: '/muktifarm/admin',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'animals', element: <Animals /> },
      { path: 'animals/register', element: <RegisterAnimal /> },
      { path: 'animals/daily-food', element: <DailyFood /> },
      { path: 'animals/daily-milk', element: <DailyMilk /> },
      { path: 'animals/heat', element: <Heat /> },
      { path: 'animals/catalogue', element: <Catalogue /> },
      { path: 'milk/*', element: <Milk /> },
      { path: 'health', element: <Health /> },
      { path: 'health/log', element: <Health /> },
      { path: 'health/pregnancy', element: <Pregnancy /> },
      { path: 'health/calved', element: <Calved /> },
      { path: 'vaccinations', element: <Vaccinations /> },
      { path: 'vaccinations/buy', element: <Vaccinations /> },
      { path: 'sales', element: <Sales /> },
      { path: 'sales/new', element: <Sales /> },
      { path: 'settings', element: <Settings /> },
      { path: 'settings/items', element: <Items /> },
      { path: 'settings/livestocks', element: <Livestocks /> },
      { path: 'settings/products', element: <Products /> },
      { path: 'settings/fodder', element: <Fodder /> },
      { path: 'settings/buyers', element: <Buyers /> },
      { path: 'settings/vendors', element: <Vendors /> },
      { path: 'settings/doctors', element: <Doctors /> },
      { path: 'breeding', element: <Breeding /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'reports', element: <Reports /> },
      { path: 'employees', element: <Employees /> },
      { path: 'enquiries', element: <ProductEnquiries /> },
      { path: 'enquiry', element: <ProductEnquiries /> },
      { path: 'contact-messages', element: <ContactMessages /> },
      { path: 'contact-us', element: <ContactMessages /> },
    ],
  },
  { path: '/', element: <MarketingPage><MarketingHome /></MarketingPage> },
  { path: '/products', element: <MarketingPage><MarketingProducts /></MarketingPage> },
  { path: '/about', element: <MarketingPage><MarketingAbout /></MarketingPage> },
  { path: '/contact', element: <MarketingPage><MarketingContact /></MarketingPage> },
  { path: '*', element: <Navigate to='/' replace /> },
], { future });

export default function App() {
  return <RouterProvider router={router} future={future} />;
}
