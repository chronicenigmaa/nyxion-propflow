// Format number as Pakistani Rupees
export const fmt = (n) =>
  "Rs. " + Number(n).toLocaleString("en-PK");

// Get initials from a full name
export const initials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// Consistent avatar color based on name
export const avatarColor = (name) => {
  const pool = [
    ["#EBF5FF", "#1C64F2"],
    ["#F5F3FF", "#6C2BD9"],
    ["#F3FAF7", "#057A55"],
    ["#FFFBEB", "#B45309"],
    ["#FDF2F2", "#E02424"],
  ];
  return pool[name.charCodeAt(0) % pool.length];
};

// Sleep helper for async flows
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Lead score → color
export const scoreColor = (score) => {
  if (score >= 80) return "#057A55";
  if (score >= 55) return "#1C64F2";
  if (score >= 35) return "#B45309";
  return "#E02424";
};
