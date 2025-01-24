import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

export function SimpleRadialChart({ score }) {
  const getGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B+";
    if (score >= 60) return "B";
    if (score >= 50) return "C+";
    if (score >= 40) return "C";
    return "D"; // Or "F" if you want to include failing grades
  };

  const getColor = (score) => {
    if (score >= 90) return "hsl(120, 100%, 40%)"; // Darker Green for A+ (Excellent)
    if (score >= 80) return "hsl(145, 80%, 50%)"; // Green for A (Good)
    if (score >= 70) return "hsl(60, 100%, 50%)"; // Orange-Yellow for B+
    if (score >= 60) return "hsl(45, 90%, 50%)"; // Yellow for B (Average)
    if (score >= 50) return "hsl(30, 100%, 50%)"; // Orange for C+
    if (score >= 40) return "hsl(15, 100%, 50%)"; // Darker Orange for C
    return "hsl(0, 80%, 50%)"; // Red for D/F (Poor)
  };

  const data = [
    {
      value: score,
      fill: getColor(score),
    },
  ];

  return (
    <div className="w-full max-w-xs mx-auto relative">
      <ResponsiveContainer width="100%" aspect={1}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="50%"
          outerRadius="80%"
          barSize={6}
          data={data}
          startAngle={270}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 145]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            clockWise
            dataKey="value"
            cornerRadius={30}
            fill={getColor(score)}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-semibold opacity-80"
          style={{ color: getColor(score) }}
        >
          {getGrade(score)}
        </span>
      </div>
    </div>
  );
}
