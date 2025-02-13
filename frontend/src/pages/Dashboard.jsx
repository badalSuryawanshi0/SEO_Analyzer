import React, { useContext, useState, useCallback } from "react";
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
import { CSVLink } from "react-csv";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function Dashboard() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { setIsLoading } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = useCallback(async (url) => {
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
          "/api/analyze",
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
  }, [setIsLoading]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
  };

  const getCsvFilename = () => {
    return `analysis-${new Date().toISOString().slice(0, 10)}.csv`;
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end mb-6 gap-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="inline-flex items-center border border-gray-300"
                aria-label="User settings"
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
              <DropdownMenuItem onClick={handleLogout} aria-label="Logout">
                <Button variant="ghost">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button>
              <LogIn className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </Link>
        )}
      </div>
      <UrlSubmitForm onSubmit={handleSubmit} />
      <Link to='/gmb'>
      <Button variant="link">Get GMB Analysis</Button>
      </Link>
      {result && suggestion == false ? (
        <SEOPreview />
      ) : (
        <SEOAnalysisResult result={result} suggestion={suggestion} url={url} />
      )}
    </div>
  );
}
