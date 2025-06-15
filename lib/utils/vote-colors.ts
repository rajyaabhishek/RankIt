// Utility functions for consistent vote colors
export const getVoteColor = (direction: "up" | "down" | null) => {
  if (direction === "up") return "text-green-500";
  if (direction === "down") return "text-red-500";
  return "text-gray-400";
};

export const getVoteBackgroundColor = (direction: "up" | "down" | null) => {
  if (direction === "up") return "bg-green-100";
  if (direction === "down") return "bg-red-100";
  return "bg-gray-100";
};

export const getVoteBorderColor = (direction: "up" | "down" | null) => {
  if (direction === "up") return "border-green-500";
  if (direction === "down") return "border-red-500";
  return "border-gray-300";
};