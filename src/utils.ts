export function toPascalCase(input: string): string {
  const cleaned = input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(s => s[0]?.toUpperCase() + s.slice(1).toLowerCase())
    .join("");
  if (!cleaned) throw new Error("Invalid module name");
  return cleaned;
}

export function toCamelCase(input: string): string {
  const pascal = toPascalCase(input);
  return pascal[0].toLowerCase() + pascal.slice(1);
}

export function toKebabOrLower(input: string): string {
  const cleaned = input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .join("")
    .toLowerCase();
  if (!cleaned) throw new Error("Invalid module name");
  return cleaned;
}

export function applyPlaceholders(template: string, nameRaw: string): string {
  const NAME = toPascalCase(nameRaw);
  const name = toKebabOrLower(nameRaw);
  const camel = toCamelCase(nameRaw);

  return template
    .replace(/__NAME__/g, NAME)
    .replace(/__name__/g, name)
    .replace(/__camel__/g, camel);
}
