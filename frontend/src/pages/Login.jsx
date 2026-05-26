import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Flower2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) { navigate('/muktifarm/admin', { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/muktifarm/admin', { replace: true });
      toast.success('Welcome back!');
    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.error ||
        (Array.isArray(data?.errors) ? data.errors.join(', ') : null) ||
        'Invalid email or password';
      console.log('Login error:', msg);
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Flower2 size={48} className="mb-6" />
          <h1 className="text-4xl font-display font-bold mb-4">DairyFarm <span className="text-amber-300">SaaS</span></h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Enterprise dairy farm management platform. Track animals, milk production, feed, health, and finances — all in one place.
          </p>
          <div className="mt-12 space-y-4">
            {['Real-time Analytics', 'Smart Inventory', 'Health Tracking', 'Financial Reports'].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-white/70">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                {f}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Flower2 className="w-6 h-6 text-primary-600" />
            <span className="font-display font-bold text-lg">Dairy<span className="text-amber-500">Farm</span></span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="admin@dairyfarm.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input-field pr-10" placeholder="Enter password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
              Default admin: <strong>admin@dairyfarm.com</strong> / <strong>password</strong>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
