import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BarChart2,
  Zap,
  Lightbulb,
  Smartphone,
} from "lucide-react";
const features = [
  {
    icon: Lightbulb,
    title: "Content Optimization Suggestions by Gemini AI",
    description:
      "Highlighted recommendations to enhance your content's readability, SEO performance, and overall effectiveness.",
  },
  {
    icon: BarChart2,
    title: "SEO Parameter Audit",
    description:
      "Get a detailed review of key SEO parameters like meta tags, headings, and social.",
  },
  {
    icon: Zap,
    title: "Page Speed Insights",
    description:
      "Measure and improve your website's loading speed for better user engagement and rankings.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendliness",
    description:
      "Analyze and optimize your website for mobile devices to ensure a seamless user experience.",
  },
];

export function SEOPreview() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full md:h-[350px] py-2 overflow-hidden">
      <CardContent className="p-6">
        <CardHeader>
          <p className="text-center text-muted-foreground">
            Boost your website's visibility with our comprehensive SEO analysis
          </p>
        </CardHeader>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`flex items-start space-x-3 ${
                index === activeIndex ? "text-primary" : "text-muted-foreground"
              }`}
              animate={{ scale: index === activeIndex ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <feature.icon className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
