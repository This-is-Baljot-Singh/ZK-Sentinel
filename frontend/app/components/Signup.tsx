'use client';
import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { useGoogleLogin } from '../lib/useGoogleLogin';

export const Signup = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();
  const { promptGoogleLogin } = useGoogleLogin();

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const mockUser: User = {
      id: Date.now().toString(),
      email: identifier.includes('@') ? identifier : undefined,
      phone: identifier.includes('@') ? undefined : identifier,
      createdAt: Date.now(),
      avatarUrl: null,
    };

    login(mockUser);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-display font-bold text-white text-center mb-8">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/70 font-body text-sm mb-2">
                Email or Phone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyber focus:border-transparent font-body"
                placeholder="Enter email or phone"
              />
            </div>

            <div>
              <label className="block text-white/70 font-body text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyber focus:border-transparent font-body"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-white/70 font-body text-sm mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyber focus:border-transparent font-body"
                placeholder="Confirm password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full backdrop-blur-sm bg-cyber/20 border border-cyber/30 rounded-lg px-6 py-3 text-cyber hover:bg-cyber/30 transition-colors font-body font-semibold"
            >
              Create Account
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-white/50">Or continue with</span>
                </div>
            </div>

            <button
              type="button"
              onClick={promptGoogleLogin}
              className="w-full rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-white h-12 px-6"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-white/60 text-center mt-6 font-body">
            Already have an account?{' '}
            {/* Updated Link usage: "to" -> "href" and no react-router-dom Link */}
            <Link href="/login" className="text-cyber hover:text-cyber/80">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};