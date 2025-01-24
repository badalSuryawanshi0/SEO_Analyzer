import { calculateMobileFriendliness } from "./mobileFriendliness.js";

export const extractPageSpeedData = (response, metricsCallback) => {
  try {
    // Extract Loading Experience Metrics
    const loadingExperience =
      response?.loadingExperience?.metrics.FIRST_CONTENTFUL_PAINT_MS.category ||
      "";
    const originLoadingExperience =
      response?.originLoadingExperience?.metrics.FIRST_CONTENTFUL_PAINT_MS
        .category || "";

    // Extract Lighthouse Metrics
    const lighthouse = response?.lighthouseResult;
    const performanceScore = Math.round(
      (lighthouse?.categories?.performance?.score * 100).toFixed(0) || 0
    ); // Convert to percentage

    const audits = lighthouse?.audits || {};
    const firstContentfulPaint = audits["first-contentful-paint"]?.displayValue;
    const speedIndex = audits["speed-index"]?.displayValue;
    const timeToInteractive = audits["interactive"]?.displayValue;
    // const inputLatency = audits["estimated-input-latency"]?.displayValue;
    const largestContentfulPaint =
      audits["largest-contentful-paint"]?.displayValue;
    const cumulativeLayoutShift =
      audits["cumulative-layout-shift"]?.displayValue;
    const totalBlockingTime = audits["total-blocking-time"]?.displayValue;

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
