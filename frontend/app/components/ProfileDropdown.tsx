'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

// import { useNavigate } from 'react-router-dom';

import { useRouter } from 'next/navigation';

export const ProfileDropdown = () => {
  const { state, updateUser, logout } = useAppContext();

  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = state.user;
  const displayName = user?.email || user?.phone || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    setIsOpen(!isOpen);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      updateUser({ avatarUrl: url });
    }
  };

  const handleLogout = () => {
    logout();
    // 🟢 Use router.push instead of navigate
    router.push('/login');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={handleAvatarClick}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-10 h-10 rounded-full bg-cyber/20 border border-cyber/30 flex items-center justify-center overflow-hidden">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-cyber font-semibold text-lg">{initials}</span>
          )}
        </div>
        <span className="text-white font-body text-sm hidden sm:block">{displayName}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 backdrop-blur-xl bg-black/80 border border-white/10 rounded-lg shadow-xl z-50"
          >
            <div className="p-2">
              <button
                onClick={handleUploadClick}
                className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-md transition-colors font-body text-sm"
              >
                Upload Profile Image
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors font-body text-sm"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};