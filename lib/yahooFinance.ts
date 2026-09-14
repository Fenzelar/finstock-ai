import yahooFinanceExport from "yahoo-finance2";

// yahoo-finance2 changed its API between major versions:
// - v2: default export is a ready-to-use object — call it directly.
// - v3+: default export is a class — must be instantiated with `new`.
// Depending on exactly which version npm resolves, either shape can show up,
// so we detect it at runtime instead of hardcoding one style.
const exported: any = yahooFinanceExport;

export const yahooFinance = typeof exported === "function" ? new exported() : exported;
