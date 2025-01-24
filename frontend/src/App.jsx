import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/AdminDashBoard";
import { ProtectedRoute } from "./components/ProtectedRoute";
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Dashboard />,
    },

    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
}
export default App;
