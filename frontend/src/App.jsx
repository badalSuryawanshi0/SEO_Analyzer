import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/AdminDashBoard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Signup } from "./pages/Signup";
import GmbSearch from "./pages/GmbDashboard";
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path:'/signup',
      element: <Signup/>
    },
    {
      path: "/",
      element: <Dashboard />,
    },

    {
      path:"/gmb",
      element: <GmbSearch/>

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
