import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { compileToHtml } from "./engine.js";

const inputArgument = process.argv[2];
if (!inputArgument) {
  console.error("Usage: node src/cli.js examples/hello.yasin");
  process.exit(1);
}

try {
  const inputPath = path.resolve(process.cwd(), inputArgument);
  const source = await readFile(inputPath, "utf8");
  const result = compileToHtml(source);

  if (result.errors.length > 0) {
    console.error("YasinCode found a problem:");
    for (const error of result.errors) {
      const line = error.line > 0 ? `Line ${error.line}: ` : "Program: ";
      console.error(`- ${line}${error.message}`);
    }
    process.exit(1);
  }

  const outputDirectory = path.resolve(process.cwd(), "dist");
  await mkdir(outputDirectory, { recursive: true });
  const outputPath = path.join(outputDirectory, "index.html");
  await writeFile(outputPath, result.html, "utf8");
  console.log(`Success! Your website was created at: ${outputPath}`);
} catch (error) {
  console.error(`Could not build your YasinCode file: ${error.message}`);
  process.exit(1);
}
