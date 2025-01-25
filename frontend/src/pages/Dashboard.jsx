import React, { useContext, useState } from "react";
import { UrlSubmitForm } from "@/components/UrlSubmitForm";
import { SEOAnalysisResult } from "@/components/ResultsTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { LogIn, LogOut, UserCog, ChevronDown, Settings2 } from "lucide-react";
import { AuthContext } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { SEOPreview } from "@/components/SeoPreview";
export function Dashboard() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { setIsLoading } = useContext(AuthContext);
  console.log(result);
  const handleSubmit = async (url) => {
    const apiCall = async () => {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      const headers = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;
      try {
        const res = await axios.post(
          "https://localhost:3000/api/analyze",
          { url },
          { withCredentials: true },
          headers
        );
        setUrl(res.data.websiteUrl);
        setResult(res.data.result);
        setSuggestion(res.data.suggestion);
        return res.data;
      } catch (error) {
        if (error.response?.status === 429) {
          //error msg for rate-limit
          throw new Error(error.response.data.message);
        }
        throw new Error(error.response?.data?.message || "Please try again");
      } finally {
        setIsLoading(false);
      }
    };
    toast.promise(apiCall(), {
      loading: "Loading ...",
      success: (data) =>
        `${data.message || "URL analysis finished. See results below"}`,
      error: (error) =>
        `${error.message || "An error occurred. Please try again"}`,
    });
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Admin Login Button */}
      <div className="flex justify-end mb-6 gap-4">
        {isAuthenticated ? (
          // Dropdown for authenticated users
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="inline-flex items-center border border-gray-300"
              >
                <UserCog className="mr-2" />
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-15">
              <DropdownMenuItem>
                <Button variant="ghost">
                  <Link to="/admin" className="flex">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Configure
                  </Link>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <Button variant="ghost">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Login button for unauthenticated users
          <Button>
            <Link
              to="/login"
              className="inline-flex items-center px-2 py-2 rounded-lg shadow-sm text-sm font-medium focus:outline-none"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Admin Login
            </Link>
          </Button>
        )}
      </div>
      <UrlSubmitForm onSubmit={handleSubmit} />
      {result && suggestion == false ? (
        <SEOPreview />
      ) : (
        <SEOAnalysisResult result={result} suggestion={suggestion} url={url} />
      )}
    </div>
  );
}
