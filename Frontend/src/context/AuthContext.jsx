import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

const initialState = { user: null, loading: true, error: null };

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':    return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGOUT':      return { ...initialState, loading: false };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR':   return { ...state, error: action.payload, loading: false };
    default:            return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check session on mount
  useEffect(() => {
    api.get('/auth/me')
      .then(res => dispatch({ type: 'SET_USER', payload: res.data.user }))
      .catch(() => dispatch({ type: 'LOGOUT' }));
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const res = await api.post('/auth/login', { email, password });
    dispatch({ type: 'SET_USER', payload: res.data.user });
    return res.data.user;
  };

  const register = async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const res = await api.post('/auth/register', data);
    dispatch({ type: 'SET_USER', payload: res.data.user });
    return res.data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
