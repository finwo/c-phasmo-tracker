export function classFrom(subject: Record<string, any>) {
  return Object.entries(subject)
    .filter(([name, value]) => value)
    .map(([name, value]) => name)
    .join(' ');
}
