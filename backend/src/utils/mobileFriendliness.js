export const calculateMobileFriendliness = (lighthouseResult) => {
  console.log(lighthouseResult);
  const weights = {
    FCP: 0.3,
    LCP: 0.3,
    CLS: 0.2,
    TBT: 0.1,
    SI: 0.1,
  };
  const maxScores = {
    FCP: 2.0, //Ideal FCP in seconds
    LCP: 2.5,
    CLS: 0.1,
    TBT: 200, //Ideal TBT in ms
  };
  //function to extract numeric value from strings
  const parseMetric = (metric) => {
    if (typeof metric === "string") {
      //If typeOf is string then convert it to number
      return parseFloat(metric.replace(/[^\d.]/g, "")); //remove all non-numeric character expect "."
    }
    return metric; // if already a number, return as-it-is
  };
  const scores = {
    FCP: Math.max(
      0,
      100 -
        (parseMetric(lighthouseResult.firstContentfulPaint) / maxScores.FCP) *
          100
    ),
    LCP: Math.max(
      0,
      100 -
        (parseMetric(lighthouseResult.largestContentfulPaint) / maxScores.LCP) *
          100
    ),
    CLS: Math.max(
      0,
      100 -
        (parseMetric(lighthouseResult.cumulativeLayoutShift) / maxScores.CLS) *
          100
    ),
    TBT: Math.max(
      0,
      100 -
        (parseMetric(lighthouseResult.totalBlockingTime) / maxScores.TBT) * 100
    ),
  };
  const mobileFriendlinessScore =
    weights.FCP * scores.FCP +
    weights.LCP * scores.LCP +
    weights.CLS * scores.CLS +
    weights.TBT * scores.TBT;
  console.log("calculate mobile friendliness :", mobileFriendlinessScore);
  return Math.round(mobileFriendlinessScore); //Normalize the score 1-100
};
