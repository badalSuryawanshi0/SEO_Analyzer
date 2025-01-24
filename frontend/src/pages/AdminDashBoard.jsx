import React, { useContext, useEffect, useState } from "react";
import { LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Link, replace, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/components/AuthProvider";

export function AdminDashboard() {
  const [parameters, setParameters] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(replace);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchParameter = async () => {
      try {
        console.log(token);
        const response = await axios.get("http://localhost:3000/api/v1/param", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setParameters(response.data);
      } catch (error) {
        console.log(error.message);
        toast.error("Error fetching Parameter");
      }
    };
    fetchParameter();
  }, []);

  const handleParameterChange = (id, field, value) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const handleSave = async () => {
    console.log("Saving parameters:", parameters);
    const apiCall = async () => {
      const response = await axios.patch(
        "http://localhost:3000/api/v1/param",
        parameters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(
        "Updated data that we are getting from server",
        response.data
      );
      setParameters(response.data.updatedParameters);
      return response.data;
    };

    toast.promise(apiCall(), {
      loading: "Loading...",
      success: (data) => `${data.message || "Parameter updated successfully!"}`,
      error: (error) =>
        `Error: ${error.response?.data?.message || "Please try again!"}`,
    });
  };
  function handleLogout() {
    navigate("/", { replace: true });

    localStorage.removeItem("text");

    setIsAuthenticated(false);
    console.log("Pew PEw");
  }

  return (
    <div className="h-[650px] max-w-2xl mx-auto my-10">
      <Card className="shadow-md">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-800">
              SEO Parameters
            </h3>

            <div>
              <Link to="/">
                <Button
                  variant="secondary"
                  className="hover: border-4 hover:border-gray-300"
                >
                  Home
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className=" hover: border-2 hover:border-gray-300"
              >
                <LogOut className="h-4 w-4  " />
              </Button>
            </div>
          </div>

          {/* Parameter List */}
          <div className="space-y-4">
            {parameters.map((param) => (
              <div
                key={param.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 shadow-sm hover:shadow transition"
              >
                {/* Input Field */}
                <Input
                  value={param.name}
                  onChange={(e) =>
                    handleParameterChange(param.id, "name", e.target.value)
                  }
                  className="flex-1 mr-4 font-semibold " // Added className for better spacing
                />
                {/* Active Checkbox */}
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={param.isActive}
                    onCheckedChange={(checked) =>
                      handleParameterChange(param.id, "isActive", checked)
                    }
                  />
                  <span className="text-gray-700 font-medium">Active</span>
                </label>
              </div>
            ))}
            <Button onClick={handleSave} variant="default">
              <Save size={20} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
