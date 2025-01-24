import { createContext, useState } from "react";

//create context
export const AuthContext = createContext();
//create contextProvider
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoding, setIsLoading] = useState(false);
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, isLoding, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
