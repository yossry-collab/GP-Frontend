export const TOOLTIP_STYLE = {
  backgroundColor: "rgba(255,255,255,0.96)",
  border: "none",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "12px",
  boxShadow: "0 0 2px rgba(145,158,171,0.24), -20px 20px 40px -4px rgba(145,158,171,0.24)",
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
  }
};

export const getProductCategoryStyle = (cat: string) => {
  switch (cat) {
    case "game":
      return "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400";
    case "software":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
    case "gift-card":
      return "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

/**
 * Custom renderer for Recharts Pie chart labels with connecting lines
 */
export const renderCustomPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return {
    x,
    y,
    text: `${name} ${((percent || 0) * 100).toFixed(1)}%`,
    textAnchor: x > cx ? "start" : "end",
  };
};
