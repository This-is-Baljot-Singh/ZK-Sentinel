'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';

interface GoogleCredentialResponse {
  credential: string;
}

interface GooglePayload {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export const useGoogleLogin = () => {
  const { login } = useAppContext();
  const scriptLoaded = useRef(false);

  const handleCredentialResponse = useCallback((response: GoogleCredentialResponse) => {
    try {
      // Decode the JWT token to get user info
      const payload: GooglePayload = JSON.parse(atob(response.credential.split('.')[1]));

      const googleUser: User = {
        id: payload.sub,
        email: payload.email,
        displayName: payload.name,
        avatarUrl: payload.picture,
        provider: 'google',
        idToken: response.credential,
        createdAt: Date.now(),
      };

      login(googleUser);
    } catch (error) {
      console.error('Error handling Google login:', error);
    }
  }, [login]);

  const initializeGoogle = useCallback((clientId: string) => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }, [handleCredentialResponse]);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID not set');
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded.current = true;
      initializeGoogle(clientId);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [initializeGoogle]);

  const promptGoogleLogin = () => {
    if (window.google && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    }
  };

  return { promptGoogleLogin };
};