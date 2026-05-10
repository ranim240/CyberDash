import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // vos styles globaux si vous en avez
import { AuthProvider } from "./context/AuthContext.jsx";
import AppRouter from "./router/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* AuthProvider en dehors du router pour que PrivateRoute ait accès au contexte */}
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>
);