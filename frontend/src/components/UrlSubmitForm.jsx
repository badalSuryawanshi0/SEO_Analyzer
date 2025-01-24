import React, { useContext, useState } from "react";
import { Search, Link as LinkIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { AuthContext } from "./AuthProvider";

export function UrlSubmitForm({ onSubmit }) {
  const [url, setUrl] = useState("");
  const { isLoding } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (url) {
      onSubmit(url);
      console.log("Pew Pew Url from UrlSubmitForm", url);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Analyze Your Website's SEO
          </h2>
          <p className="text-gray-500">
            Get instant insights about your website's SEO performance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter a URL and click 'Analyze' to get SEO insights"
                  required
                />
              </div>
            </div>

            <div className="pt-1">
              {isLoding ? (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">
                  <Search className="w-5 h-5" />
                  <span>Analyze</span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
