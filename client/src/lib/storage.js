const TOKEN_KEY = "exp_token";
export const setToken  = (t) => localStorage.setItem(TOKEN_KEY, t);
export const getToken  = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
