import { createContext, useEffect, useMemo, useState } from "react";
import {
  getMe,
  loginUser,
  registerUser,
  updateEmail as updateEmailRequest,
  updatePassword as updatePasswordRequest,
  updatePaymentMethod as updatePaymentMethodRequest,
  updateProfile as updateProfileRequest,
} from "../services/authService";

export const AuthContext = createContext(null);

const TOKEN_KEY = "gm_token";
const USER_KEY = "gm_user";

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(getStoredUser());
  const [isInitializing, setIsInitializing] = useState(
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

  const persistAuth = (authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  };

  const persistUser = (currentUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
  };

  const login = async (credentials) => {
    const authData = await loginUser(credentials);
    persistAuth(authData);
    return authData;
  };

  const register = async (payload) => {
    const authData = await registerUser(payload);
    persistAuth(authData);
    return authData;
  };

  const logout = () => {
    clearAuth();
  };

  const updateProfile = async (payload) => {
    const currentUser = await updateProfileRequest(payload);
    persistUser(currentUser);
    return currentUser;
  };

  const updatePaymentMethod = async (payload) => {
    const currentUser = await updatePaymentMethodRequest(payload);
    persistUser(currentUser);
    return currentUser;
  };

  const updateEmail = async (payload) => {
    const authData = await updateEmailRequest(payload);
    persistAuth(authData);
    return authData;
  };

  const updatePassword = async (payload) => {
    const currentUser = await updatePasswordRequest(payload);
    persistUser(currentUser);
    return currentUser;
  };

  useEffect(() => {
    async function initializeAuth() {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const currentUser = await getMe();
        persistUser(currentUser);
      } catch {
        clearAuth();
      } finally {
        setIsInitializing(false);
      }
    }

    initializeAuth();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login,
      register,
      logout,
      updateProfile,
      updatePaymentMethod,
      updateEmail,
      updatePassword,
    }),
    [token, user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}