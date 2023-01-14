import type { TState } from '../types';

const AppReducer = (state: TState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'GET_ARTICLES':
      return {
        ...state,
        loading: false,
        articles: action.payload,
      };
    case 'GET_SINGLE_ARTICLE':
      return {
        ...state,
        loading: false,
        article: action.payload,
      };
    case 'API_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
export default AppReducer;
