import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";

// ─── création du contexte ─────────────────────────────────────────────────────
export const AuthContext = createContext(null);

// ─── provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {

  const [user, setUser]       = useState(null);   // { userId, username, role, ... }
  const [loading, setLoading] = useState(true);   // true le temps de vérifier le token

  // ── au montage : vérifier si un token valide existe déjà ──────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // appel vers votre backend pour récupérer le profil depuis le token
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // token expiré ou invalide → on nettoie
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  // appelé depuis votre page Login après succès
  // data = { token, user: { userId, username, role } }
  const login = useCallback((data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }, []);

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  // ── valeurs exposées ───────────────────────────────────────────────────────
  const value = {
    user,       // null si non connecté, sinon { userId, username, role }
    loading,    // true pendant la vérification initiale du token
    login,      // (data) => void
    logout,     // () => void
    isLearner : user?.role === "learner",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};