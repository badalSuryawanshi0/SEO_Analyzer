import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LinkIcon,
  Heading,
  Gauge,
  Zap,
  Smartphone,
  Tags,
  CircleFadingPlus,
} from "lucide-react";
import { SimpleRadialChart } from "./radicalComponent";

// Component for rendering a result card
const ResultCard = ({ title, value }) => {
  if (value === undefined || value === null) return null;

  return (
    <Card className="border border-gray-300 ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm  font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <SimpleRadialChart score={value} />
      </CardContent>
    </Card>
  );
};

// Component for rendering suggestions in an accordion
const SuggestionAccordion = ({ suggestions }) => {
  if (!suggestions) return null;

  const renderContent = (value) => {
    if (typeof value === "string") {
      //of value is string then directly return else return sub-doc
      return <p className="text-sm text-muted-foreground">{value}</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(value).map(([subKey, subValue]) => (
          <div key={subKey}>
            <h4 className="font-semibold">
              {subKey.charAt(0).toUpperCase() + subKey.slice(1)}
            </h4>
            {renderContent(subValue.recommendation || subValue)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(suggestions).map(([key, value]) => (
        <AccordionItem key={key} value={key}>
          <AccordionTrigger>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </AccordionTrigger>
          <AccordionContent>{renderContent(value)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

// Main Component
export function SEOAnalysisResult({ result, suggestion, url }) {
  return (
    <div className="space-y-8">
      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Analysis Results</CardTitle>
          <CardDescription>{url}</CardDescription>
          <CardDescription>
            Overview of your website's SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Cards for Individual Results */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(result).map(([key, value]) => {
              return (
                <ResultCard
                  key={key}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                />
              );
            })}
            {/* <ResultCard
              title={Object.keys(result)[0]}
              value={result?.mobileFriendliness}
              icon={Smartphone}
            />
            <ResultCard
              title="Loading Experience"
              value={result?.loadingExperience}
              icon={Zap}
            />
            <ResultCard
              title="Origin Loading"
              value={result?.originLoadingExperience}
              icon={Zap}
            />
            <ResultCard
              title="Total Links"
              value={result?.links}
              icon={LinkIcon}
            />
            <ResultCard
              title="Performance Score"
              value={result?.performanceScore}
              icon={Gauge}
            />
            <ResultCard
              title="Meta Tags"
              value={result?.metaTags}
              icon={Tags}
            />
            <ResultCard
              title="Headings"
              value={result?.headings}
              icon={Heading}
            />
            <ResultCard
              title="Social"
              value={result?.social}
              icon={CircleFadingPlus}
            /> */}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Section */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Suggestions</CardTitle>
          <CardDescription>
            Recommendations to improve your website's SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuggestionAccordion suggestions={suggestion} />
        </CardContent>
      </Card>
    </div>
  );
}
