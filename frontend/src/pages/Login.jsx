import { useContext, useState } from "react";
import { LogIn } from "lucide-react";
import { AuthContext } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiCall = async () => {
      const response = await axios.post("/api/signin", {
        email,
        password,
      });
      const jwtToken = response.data.token;
      localStorage.setItem("token", jwtToken);
      setIsAuthenticated(true);
      navigate("/admin");
      return response.data;
    };
    toast.promise(apiCall(), {
      success: (data) => `${data.message || "Logged in successfully!"}`,
      loading: "loading .....",
      error: (error) => `${error.response.data.message || "Login failed"}`,
    });
  };

  return (
    <div className=" min-h-[650px] bg-gradient-to-br w-full flex items-center justify-center">
      <div className="w-full max-w-sm">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-500">
              Sign in to access your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm pb-2 font-medium text-gray-700"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block pb-2 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign in
              </Button>
              <Link to="/signup">
                <Button variant="link">Create an Account </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
