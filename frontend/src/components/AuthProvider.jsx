import { createContext, useState } from "react";

//create context
export const AuthContext = createContext();
//create contextProvider
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
