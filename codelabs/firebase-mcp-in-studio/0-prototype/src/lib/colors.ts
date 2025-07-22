export const WHEEL_COLORS = [
  "#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D",
  "#43AA8B", "#4D908E", "#577590", "#277DA1", "#F9844A",
  "#B56576", "#E56B6F", "#6D597A", "#355070",
];

export function generateColors(numColors: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(WHEEL_COLORS[i % WHEEL_COLORS.length]);
  }
  return colors;
}
