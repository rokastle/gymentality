import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextValue";
import {
  getMe,
  loginUser,
  registerUser,
  updateEmail as updateEmailRequest,
  updatePassword as updatePasswordRequest,
  updatePaymentMethod as updatePaymentMethodRequest,
  updateProfile as updateProfileRequest,
} from "../services/authService";

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

  const persistAuth = useCallback((authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const persistUser = useCallback((currentUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const authData = await loginUser(credentials);
    persistAuth(authData);
    return authData;
  }, [persistAuth]);

  const register = useCallback(async (payload) => {
    const authData = await registerUser(payload);
    persistAuth(authData);
    return authData;
  }, [persistAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const updateProfile = useCallback(async (payload) => {
    const currentUser = await updateProfileRequest(payload);
    persistUser(currentUser);
    return currentUser;
  }, [persistUser]);

  const updatePaymentMethod = useCallback(async (payload) => {
    const currentUser = await updatePaymentMethodRequest(payload);
    persistUser(currentUser);
    return currentUser;
  }, [persistUser]);

  const updateEmail = useCallback(async (payload) => {
    const authData = await updateEmailRequest(payload);
    persistAuth(authData);
    return authData;
  }, [persistAuth]);

  const updatePassword = useCallback(async (payload) => {
    const currentUser = await updatePasswordRequest(payload);
    persistUser(currentUser);
    return currentUser;
  }, [persistUser]);

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
  }, [clearAuth, persistUser, token]);

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
    [
      token,
      user,
      isInitializing,
      login,
      register,
      logout,
      updateProfile,
      updatePaymentMethod,
      updateEmail,
      updatePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
