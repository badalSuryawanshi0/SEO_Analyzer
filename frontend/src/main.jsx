import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster, toast } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
if (process.env.NODE_ENV === "production") disableReactDevTools();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-center" richColors expand={true} />
    </AuthProvider>
  </StrictMode>
);
