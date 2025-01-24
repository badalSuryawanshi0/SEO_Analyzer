export const cheerioInsightScores = (cheerioInsight) => {
  console.log("From calculate Score function", cheerioInsight);
  try {
    const scoringCriteria = {
      metadescription: {
        length: { min: 20, max: 160 },
      },
      headings: {
        h1: { count: 5 },
        h2: { count: 10 },
      },
      links: {
        internal: { count: 20 },
        external: { count: 10 },
      },
      social: {
        facebook: { presence: true },
        twitter: { presence: true },
        linkedin: { presence: true },
        instagram: { presence: true },
      },
    };
    //calculated score for each category
    const rawScores = {
      metaDescription: calculateMetaDescriptionScore(
        cheerioInsight.metaTags.description,
        scoringCriteria.metadescription
      ),
      metaKeywords: cheerioInsight.metaTags.keywords ? 1 : 0,

      socialMeta: calculateSocialMetaTags(cheerioInsight.metaTags.social),
      headings: calculateHeadingScore(
        cheerioInsight.headings,
        scoringCriteria.headings
      ),
      links: calculateLinksScore(cheerioInsight.links, scoringCriteria.links),
      social: calculateSocialScore(cheerioInsight.social),
    };

    const weights = {
      metaDescription: 0.5, //50%
      metaKeywords: 0.1, //10%
      socialMeta: 0.4, //40%
    };
    const metaTagsScore =
      rawScores.metaDescription * weights.metaDescription +
      rawScores.metaKeywords * weights.metaKeywords +
      rawScores.socialMeta * weights.socialMeta;

    //Normalize scores to a scale of 1-100
    const normalizedScores = {
      metaTags: Math.round(metaTagsScore * 100),
      headings: Math.round(rawScores.headings * 100),
      links: Math.round(rawScores.links * 100),
      social: Math.round(rawScores.social * 100),
    };
    return normalizedScores;
  } catch (error) {
    console.log("Error calculating Score", error);
  }
};

function calculateMetaDescriptionScore(metaDescription, criteria) {
  const lenght = metaDescription?.length || 0;
  const idealLength = criteria.length;
  return Math.min(
    1,
    Math.max(
      0,
      (lenght - idealLength.min) / (idealLength.max - idealLength.min)
    )
  );
}
function calculateHeadingScore(headings, criteria) {
  const h1Score = Math.min(1, (headings?.h1.length || 0) / criteria.h1.count);
  const h2Score = Math.min(1, headings?.h2.length || 0 / criteria.h2.count);
  return (h1Score + h2Score) / 2;
}
function calculateLinksScore(links, criteria) {
  const internalScore = Math.min(
    1,
    links.internal.length / criteria.internal.count
  );
  const externalScore = Math.min(
    1,
    links.external.length / criteria.external.count
  );
  return (internalScore + externalScore) / 2;
}
function calculateSocialScore(social, criteria) {
  const twitter = social.twitter ? 1 : 0;
  const facebook = social.facebook ? 1 : 0;
  const linkedin = social.linkedin ? 1 : 0;
  const instagram = social.instagram ? 1 : 0;
  return (twitter + facebook + linkedin + instagram) / 4;
}
function calculateSocialMetaTags(socialMeta) {
  const ogDescription = socialMeta.ogDescription ? 1 : 0;
  const ogTitle = socialMeta.ogTitle ? 1 : 0;
  return (ogDescription + ogTitle) / 2;
}
