/**
 * SVG Asset Validator - Development Tool
 *
 * Run this in the browser console to validate all SVG assets
 * and identify which ones might have export issues.
 *
 * Usage:
 * 1. Open the app in your browser
 * 2. Open the browser console (F12)
 * 3. Run: await window.validateAllSVGs()
 */

import {
  validateAllAssets,
  logValidationResults,
  generateValidationReport,
} from "./svgValidator";

// Expose validation functions to window for console access
declare global {
  interface Window {
    validateAllSVGs: () => Promise<void>;
    validateSVGCategory: (category: string) => Promise<void>;
  }
}

/**
 * Validate all SVG assets and log results to console
 */
window.validateAllSVGs = async () => {
  console.log("🔍 Starting SVG validation...");
  console.time("Validation completed in");

  const { total, valid, withWarnings, invalid, results } =
    await validateAllAssets();

  console.log("\n📊 Validation Summary:");
  console.log(`Total SVGs: ${total}`);
  console.log(`✅ Valid: ${valid}`);
  console.log(`⚠️  With Warnings: ${withWarnings}`);
  console.log(`❌ Invalid: ${invalid}`);

  logValidationResults(results);

  console.timeEnd("Validation completed in");

  // Generate and log the report
  const report = generateValidationReport(results);
  console.log("\n📄 Full Report:\n");
  console.log(report);

  // Download report as file
  const blob = new Blob([report], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "svg-validation-report.md";
  console.log("\n💾 Downloading validation report...");
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Validate SVGs in a specific category
 */
window.validateSVGCategory = async (category: string) => {
  console.log(`🔍 Validating ${category} SVGs...`);

  try {
    const response = await fetch("/assets/assets-manifest.json");
    const manifest = (await response.json()) as Record<
      string,
      Array<{ file: string }>
    >;

    const categoryData = manifest[category.toLowerCase()];
    if (!categoryData || !Array.isArray(categoryData)) {
      console.error(`❌ Category "${category}" not found in manifest`);
      return;
    }

    const results = new Map();
    for (const asset of categoryData) {
      const { validateSVG } = await import("./svgValidator");
      const path = `/assets/svg/${category.toLowerCase()}/${asset.file}`;
      const result = await validateSVG(path);
      results.set(path, result);
    }

    logValidationResults(results);
  } catch (error) {
    console.error("Failed to validate category:", error);
  }
};

console.log(`
╔════════════════════════════════════════════════════════╗
║       🎨 Kubito Maker - SVG Validator Loaded          ║
╚════════════════════════════════════════════════════════╝

Available commands:

  📋 await window.validateAllSVGs()
     Validate all SVG assets and download a report
     
  🔍 await window.validateSVGCategory('eyes')
     Validate SVGs in a specific category
     
Categories: eyes, mouths, hairs, accessories, backgrounds, bodies

`);

export {};
