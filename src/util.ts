export function rating2color(x: number) {
  if (x < 1200) return 'gray';
  if (x < 1400) return 'green';
  if (x < 1600) return '#03A89E';
  if (x < 1900) return 'blue';
  if (x < 2100) return '#a0a';
  if (x < 2400) return '#FF8C00';
  return 'red';
}
