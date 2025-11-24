import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";

export default function RedirectIfAuth({ children }) {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <Loader/>

  return authUser ? <Navigate to="/account" replace /> : children;
}
