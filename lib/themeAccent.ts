export function themeAccent(): string {
  if (typeof document === "undefined") return "#FF6B35";
  return document.documentElement.dataset.theme === "light" ? "#7F011F" : "#FF6B35";
}
