const FIELD_STYLES = {
  A: { key: "A", label: "Field A", color: "#3b82f6", bg: "rgba(59,130,246,0.14)", border: "rgba(59,130,246,0.42)" },
  B: { key: "B", label: "Field B", color: "#f59e0b", bg: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.42)" },
  C: { key: "C", label: "Field C", color: "#22c55e", bg: "rgba(34,197,94,0.14)", border: "rgba(34,197,94,0.42)" },
  D: { key: "D", label: "Field D", color: "#a855f7", bg: "rgba(168,85,247,0.14)", border: "rgba(168,85,247,0.42)" },
  DEFAULT: {
    key: "-",
    label: "Field",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
    border: "rgba(100,116,139,0.36)",
  },
};

export function extractFieldKey(text) {
  const match = String(text || "").match(/field\s*([A-D])/i);
  return match ? match[1].toUpperCase() : null;
}

export function getFieldStyle(text) {
  const key = extractFieldKey(text);
  return FIELD_STYLES[key] || FIELD_STYLES.DEFAULT;
}

export const fieldLegend = [FIELD_STYLES.A, FIELD_STYLES.B, FIELD_STYLES.C, FIELD_STYLES.D];
