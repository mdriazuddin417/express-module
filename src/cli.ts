#!/usr/bin/env node
import { Command } from "commander";
import { generateModule } from "./generate";

const program = new Command();

program
  .name("express-module")
  .description("Generate one or many CRUD module folders under ./modules (auto-created)")
  .argument("<names...>", "module name(s) e.g. student teacher user auth")
  .option(
    "-o, --out <path>",
    "output base directory (default: src/app/modules)",
    "src/app/modules"
  )
  .option("-f, --force", "overwrite existing folder(s)", false)
  .option("--dry-run", "print the files that would be created", false)
  .action(async (names: string[], options: { out: string; force: boolean; dryRun: boolean }) => {
    try {
      const allCreated: string[] = [];
      for (const name of names) {
        const created = await generateModule(name, { outDir: options.out, force: options.force, dryRun: options.dryRun });
        allCreated.push(...created);
      }

      if (options.dryRun) {
        // eslint-disable-next-line no-console
        console.log(allCreated.join("\n"));
        return;
      }

      // eslint-disable-next-line no-console
      console.log(`Created ${names.length} module(s) in ./${options.out}`);
      // eslint-disable-next-line no-console
      console.log(allCreated.join("\n"));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err?.message ?? String(err));
      process.exit(1);
    }
  });

program.parse(process.argv);
