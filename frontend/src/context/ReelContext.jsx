import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const ReelContext = createContext(null);

function reelReducer(state, action) {
  switch (action.type) {
    case 'SET_REELS':
      return { ...state, reels: action.payload.reels, loading: false,
               page: action.payload.page, totalPages: action.payload.pages };
    case 'APPEND_REELS':
      return { ...state,
               reels: [...state.reels, ...action.payload.reels],
               loading: false,
               page: action.payload.page,
               totalPages: action.payload.pages };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'TOGGLE_LIKE':
      return {
        ...state,
        reels: state.reels.map(r =>
          r._id === action.payload.reelId
            ? { ...r, likes: action.payload.liked
                ? [...(r.likes || []), action.payload.userId]
                : (r.likes || []).filter(id => id !== action.payload.userId) }
            : r
        ),
      };
    case 'TOGGLE_SAVE':
      return {
        ...state,
        reels: state.reels.map(r =>
          r._id === action.payload.reelId
            ? { ...r, saves: action.payload.saved
                ? [...(r.saves || []), action.payload.userId]
                : (r.saves || []).filter(id => id !== action.payload.userId) }
            : r
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        reels: state.reels.map(r =>
          r._id === action.payload.reelId
            ? { ...r, comments: [...(r.comments || []), action.payload.comment] }
            : r
        ),
      };
    default:
      return state;
  }
}

const initialState = { reels: [], loading: false, page: 1, totalPages: 1 };

export function ReelProvider({ children }) {
  const [state, dispatch] = useReducer(reelReducer, initialState);

  const fetchReels = useCallback(async (page = 1, cuisine = '') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (cuisine) params.append('cuisine', cuisine);
      const res = await api.get(`/reels?${params}`);
      const type = page === 1 ? 'SET_REELS' : 'APPEND_REELS';
      dispatch({ type, payload: { reels: res.data.reels, page: res.data.page, pages: res.data.pages } });
    } catch (err) {
      console.error('fetchReels error:', err.message);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []); // stable reference — no deps needed

  const toggleLike = async (reelId, userId) => {
    const res = await api.post(`/reels/${reelId}/like`);
    dispatch({ type: 'TOGGLE_LIKE', payload: { reelId, liked: res.data.liked, userId } });
    return res.data;
  };

  const toggleSave = async (reelId, userId) => {
    const res = await api.post(`/reels/${reelId}/save`);
    dispatch({ type: 'TOGGLE_SAVE', payload: { reelId, saved: res.data.saved, userId } });
    return res.data;
  };

  const addComment = async (reelId, text) => {
    const res = await api.post(`/reels/${reelId}/comment`, { text });
    dispatch({ type: 'ADD_COMMENT', payload: { reelId, comment: res.data.comment } });
    return res.data.comment;
  };

  return (
    <ReelContext.Provider value={{ ...state, fetchReels, toggleLike, toggleSave, addComment, dispatch }}>
      {children}
    </ReelContext.Provider>
  );
}

export const useReels = () => useContext(ReelContext);
