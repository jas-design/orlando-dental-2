import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      // In newer Firebase, user-not-found might be obscured as invalid-credential
      if ((err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && email === 'abraunstore@gmail.com') {
         setNeedsSetup(true);
         setError('Login failed. If this is your first time, click "Initialize Admin" to create your secure account.');
      } else {
         setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create user with a random temporary password
      const tempPass = Math.random().toString(36).slice(-10) + 'A1!';
      await createUserWithEmailAndPassword(auth, 'abraunstore@gmail.com', tempPass);
      // Immediately trigger reset
      await sendPasswordResetEmail(auth, 'abraunstore@gmail.com');
      setResetSent(true);
      setNeedsSetup(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' && email === 'abraunstore@gmail.com') {
         setNeedsSetup(true);
         setError('Account not found. You need to initialize it first.');
      } else {
         setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-brand-primary/10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-brand-dark">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your clinic website</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {resetSent ? (
          <div className="bg-green-50 border border-green-100 text-green-700 p-8 rounded-[32px] mb-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <div className="space-y-1">
               <p className="text-lg font-bold">Verification Sent!</p>
               <p className="text-sm opacity-80 leading-relaxed">Please check <b>{email}</b> for a secure link to set your password.</p>
            </div>
            <button 
              onClick={() => setResetSent(false)}
              className="text-sm font-bold text-brand-primary pt-2 block mx-auto underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : needsSetup ? (
          <div className="space-y-6">
             <div className="bg-brand-primary/5 p-6 rounded-3xl border border-brand-primary/10">
                <p className="text-sm text-brand-dark font-medium leading-relaxed">
                   Welcome! To secure your admin access for <b>{email}</b>, we need to initialize your account.
                </p>
             </div>
             <button 
                onClick={handleInitializeAdmin}
                disabled={loading}
                className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-brand-primary transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Initialize Admin
              </button>
              <button 
                onClick={() => { setNeedsSetup(false); setError(null); }}
                className="w-full text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors"
              >
                Cancel
              </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all outline-none"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">Password</label>
                <button 
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs font-bold text-brand-primary hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-brand-dark transition-colors text-sm font-medium"
          >
            ← Back to website
          </button>
        </div>
      </motion.div>
    </div>
  );
}
