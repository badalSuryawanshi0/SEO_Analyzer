import { calculateMobileFriendliness } from "./mobileFriendliness.js";

export const extractPageSpeedData = (response) => {
  try {
    console.log(response);
    // Extract Loading Experience Metrics
    const loadingExperience =
      response?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS
        ?.category || "N/A";
    const originLoadingExperience =
      response?.originLoadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS
        ?.category || "N/A";
    // Extract Lighthouse Metrics
    const lighthouse = response?.lighthouseResult || {};
    const performanceScore = Math.round(
      (lighthouse?.categories?.performance?.score * 100).toFixed(0) || 0
    ); // Convert to percentage

    const audits = lighthouse?.audits || {};
    // Extract metrics with fallbacks
    const firstContentfulPaint =
      audits["first-contentful-paint"]?.displayValue || "N/A";
    const speedIndex = audits["speed-index"]?.displayValue || "N/A";
    const timeToInteractive = audits["interactive"]?.displayValue || "N/A";
    const largestContentfulPaint =
      audits["largest-contentful-paint"]?.displayValue || "N/A";
    const cumulativeLayoutShift =
      audits["cumulative-layout-shift"]?.displayValue || "N/A";
    const totalBlockingTime =
      audits["total-blocking-time"]?.displayValue || "N/A";

    const lighthouseMetrics = {
      firstContentfulPaint,
      timeToInteractive,
      largestContentfulPaint,
      cumulativeLayoutShift,
      totalBlockingTime,
      speedIndex,
    };

    // Combine extracted data into a single object
    const mobileFriendliness = calculateMobileFriendliness(lighthouseMetrics);
    return {
      performanceScore,
      loadingExperience,
      originLoadingExperience,
      mobileFriendliness,
    };
  } catch (error) {
    console.error("Error extracting data:", error.message);
    throw error;
  }
};
