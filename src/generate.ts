import fs from "fs-extra";
import path from "path";
import { TEMPLATES } from "./templates";
import { applyPlaceholders, toKebabOrLower } from "./utils";

export type GenerateOptions = {
  outDir?: string;   // base output directory (default: modules)
  force?: boolean;   // overwrite existing
  dryRun?: boolean;  // only print actions
};

export async function generateModule(nameRaw: string, opts: GenerateOptions = {}): Promise<string[]> {
  const outDir = opts.outDir ?? "modules";
  const name = toKebabOrLower(nameRaw);

  const outAbs = path.resolve(outDir);
  const moduleDir = path.join(outAbs, name);

  // ensure base folder exists (auto-create modules/)
  if (!opts.dryRun) {
    await fs.ensureDir(outAbs);
  }

  const files = [
    { key: "controller", filename: `${name}.controller.ts` },
    { key: "service", filename: `${name}.service.ts` },
    { key: "model", filename: `${name}.model.ts` },
    { key: "interface", filename: `${name}.interface.ts` },
    { key: "validation", filename: `${name}.validation.ts` },
    { key: "route", filename: `${name}.route.ts` }
  ] as const;

  const plannedPaths = files.map(f => path.join(moduleDir, f.filename));

  if (await fs.pathExists(moduleDir)) {
    if (!opts.force) {
      throw new Error(`Folder already exists: ${moduleDir} (use --force to overwrite)`);
    }
    if (!opts.dryRun) {
      await fs.remove(moduleDir);
    }
  }

  if (opts.dryRun) return plannedPaths;

  await fs.ensureDir(moduleDir);

  for (const f of files) {
    const raw = TEMPLATES[f.key];
    const rendered = applyPlaceholders(raw, nameRaw);
    await fs.writeFile(path.join(moduleDir, f.filename), rendered, { encoding: "utf8" });
  }

  return plannedPaths;
}
