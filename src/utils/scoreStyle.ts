// This color scoring style is base on how the ai agent prompt metrics found on the resume-pipeline
// `# Score Interpretation Reference (for alignmentRationale only)\n` +
//     `  85–100: Strong Alignment    — Candidate covers nearly all core requirements with direct evidence.\n` +
//     `  65–84:  Good Potential      — Solid foundation; missing a few secondary or nice-to-have items.\n` +
//     `  40–64:  Partial Match       — Transferable skills present, but core gaps exist.\n` +
//     `  0–39:   Low Alignment       — Background does not structurally match the role's primary function.\n\n` +

/**
 * Returns Tailwind CSS color classes based on the score interpretation.
 */
export const getScoreStyle = (score: number) => {
  if (score >= 85) {
    // Strong Alignment: Green
    return {
      textColor: "text-green-900",
      bgColor: "bg-green-200",
      strokeColor: "#22c55e",
      label: "Excellent match",
      labelCls:
        "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    };
  } else if (score >= 65) {
    // Good Potential: Blue
    return {
      textColor: "text-blue-900",
      bgColor: "bg-blue-200",
      strokeColor: "#3b82f6",
      label: "Good match",
      labelCls: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    };
  } else if (score >= 40) {
    // Partial Match: Yellow/Orange
    return {
      textColor: "text-yellow-900",
      bgColor: "bg-yellow-200",
      strokeColor: "#f59e0b",
      label: "Partial match",
      labelCls:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    };
  } else {
    // Low Alignment: Red
    return {
      textColor: "text-red-900",
      bgColor: "bg-red-200",
      strokeColor: "#ef4444",
      label: "Weak match",
      labelCls: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    };
  }
};
