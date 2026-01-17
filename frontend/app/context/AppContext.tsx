'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import {
  Document,
  ActivityEvent,
  Settings,
  AppState,
  Agent,
  ZKProof,
  User,
} from '../types';

type AppAction =
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: { id: string; updates: Partial<Document> } }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'ADD_ACTIVITY'; payload: ActivityEvent }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'UPDATE_AGENT'; payload: { id: string; updates: Partial<Agent> } }
  | { type: 'UPDATE_ZK_PROOF'; payload: Partial<ZKProof> }
  | { type: 'SET_HAS_LAUNCHED'; payload: boolean }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };


const initialAgents: Agent[] = [
  { id: '1', name: 'Voice Interviewer', role: 'Voice-based interviews', status: 'Idle', lastUpdated: Date.now() },
  { id: '2', name: 'Document Auditor', role: 'Validates documents', status: 'Idle', lastUpdated: Date.now() },
  { id: '3', name: 'Cross-Verifier', role: 'Cross checks data', status: 'Idle', lastUpdated: Date.now() },
  { id: '4', name: 'Financial Analyst', role: 'Risk analysis', status: 'Idle', lastUpdated: Date.now() },
  { id: '5', name: 'ZK-Cryptographer', role: 'Generates ZK proofs', status: 'Idle', lastUpdated: Date.now() },
  { id: '6', name: 'On-Chain Notary', role: 'Blockchain notarization', status: 'Idle', lastUpdated: Date.now() },
];

const initialZKProof: ZKProof = {
  status: 'NotGenerated',
  network: 'Polygon Amoy',
};

const initialSettings: Settings = {
  enablePIIDetection: true,
  autoEncrypt: true,
  riskThreshold: 70,
  redactionLevel: 'Partial',
  allowedFileTypes: ['PDF', 'CSV', 'JSON', 'TXT'],
  retentionDuration: 90,
  autoDeleteExpired: true,
  emailAlerts: true,
  dashboardAlerts: true,
  minSeverity: 'Info',
};

const initialState: AppState = {
  documents: [],
  activities: [],
  settings: initialSettings,
  agents: initialAgents,
  zkProof: initialZKProof,
  hasLaunched: false,
  isAuthenticated: false,
  user: null,
};


function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };

    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id
            ? { ...doc, ...action.payload.updates }
            : doc
        ),
      };

    case 'DELETE_DOCUMENT':
      return { ...state, documents: state.documents.filter(d => d.id !== action.payload) };

    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.payload, ...state.activities].slice(0, 100) };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id
            ? { ...agent, ...action.payload.updates }
            : agent
        ),
      };

    case 'UPDATE_ZK_PROOF':
      return { ...state, zkProof: { ...state.zkProof, ...action.payload } };

    case 'SET_HAS_LAUNCHED':
      return { ...state, hasLaunched: action.payload };

    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };

    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    default:
      return state;
  }
}


interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  addDocument: (doc: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;

  addActivity: (activity: Omit<ActivityEvent, 'id'>) => void;
  updateSettings: (settings: Partial<Settings>) => void;

  updateAgent: (id: string, updates: Partial<Agent>) => void;
  updateZKProof: (updates: Partial<ZKProof>) => void;

  setHasLaunched: (launched: boolean) => void;

  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);


  const addDocument = (doc: Omit<Document, 'id'>) => {
    const newDoc: Document = {
      ...doc,
      id: crypto.randomUUID(),
      expired: false,
    };

    dispatch({ type: 'ADD_DOCUMENT', payload: newDoc });

    if (state.settings.autoDeleteExpired) {
      const retentionMs = state.settings.retentionDuration * 24 * 60 * 60 * 1000;
      setTimeout(() => {
        dispatch({ type: 'DELETE_DOCUMENT', payload: newDoc.id });
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            title: 'Document Auto-Deleted',
            description: `Document ${doc.filename} expired`,
            type: 'Policy',
            severity: 'Info',
          },
        });
      }, retentionMs);
    }
  };

  const updateDocument = (id: string, updates: Partial<Document>) =>
    dispatch({ type: 'UPDATE_DOCUMENT', payload: { id, updates } });

  const deleteDocument = (id: string) =>
    dispatch({ type: 'DELETE_DOCUMENT', payload: id });


  const addActivity = (activity: Omit<ActivityEvent, 'id'>) =>
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: { ...activity, id: crypto.randomUUID() },
    });

 
  const updateSettings = (settings: Partial<Settings>) =>
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });

  const updateAgent = (id: string, updates: Partial<Agent>) =>
    dispatch({ type: 'UPDATE_AGENT', payload: { id, updates } });

  const updateZKProof = (updates: Partial<ZKProof>) =>
    dispatch({ type: 'UPDATE_ZK_PROOF', payload: updates });

  const setHasLaunched = (launched: boolean) =>
    dispatch({ type: 'SET_HAS_LAUNCHED', payload: launched });


  const login = (user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
    localStorage.setItem('auth', JSON.stringify({ user }));
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!state.user) return;
    const updated = { ...state.user, ...updates };
    dispatch({ type: 'UPDATE_USER', payload: updates });
    localStorage.setItem('auth', JSON.stringify({ user: updated }));
  };


  useEffect(() => {
    const raw = localStorage.getItem('auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.user) {
        dispatch({ type: 'LOGIN', payload: parsed.user });
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addDocument,
        updateDocument,
        deleteDocument,
        addActivity,
        updateSettings,
        updateAgent,
        updateZKProof,
        setHasLaunched,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
