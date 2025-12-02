/**
 * SVG Validation and Repair Utilities
 *
 * This module provides utilities to validate and fix common SVG issues
 * that can cause problems during export to PNG/JPG/WebP
 */

export interface SVGValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixed?: boolean;
}

/**
 * Validate an SVG file from a URL
 */
export async function validateSVG(
  svgPath: string,
): Promise<SVGValidationResult> {
  const result: SVGValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    const response = await fetch(svgPath);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");

    // Check for parsing errors
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      result.isValid = false;
      result.errors.push(`XML parsing error: ${parserError.textContent}`);
      return result;
    }

    const svgElement = doc.querySelector("svg");
    if (!svgElement) {
      result.isValid = false;
      result.errors.push("No <svg> root element found");
      return result;
    }

    // Check for common issues

    // 1. Missing viewBox
    if (!svgElement.hasAttribute("viewBox")) {
      result.warnings.push(
        "Missing viewBox attribute (may cause scaling issues)",
      );
    }

    // 2. External resources (fonts, images)
    const externalImages = svgElement.querySelectorAll(
      'image[href^="http"], image[href^="data:"]',
    );
    if (externalImages.length > 0) {
      result.warnings.push(
        `Contains ${externalImages.length} external image(s)`,
      );
    }

    // 3. External fonts
    const styleElements = svgElement.querySelectorAll("style");
    styleElements.forEach((style) => {
      const content = style.textContent || "";
      if (content.includes("@import") || content.includes("url(")) {
        result.warnings.push(
          "Contains external font or resource references in styles",
        );
      }
    });

    // 4. Scripts (should be removed for security)
    const scripts = svgElement.querySelectorAll("script");
    if (scripts.length > 0) {
      result.warnings.push(
        `Contains ${scripts.length} script tag(s) (will be removed)`,
      );
    }

    // 5. Invalid or empty attributes
    let emptyAttrs = 0;
    svgElement.querySelectorAll("*").forEach((element) => {
      Array.from(element.attributes).forEach((attr) => {
        if (
          attr.value === "" &&
          !["class", "id", "xmlns"].includes(attr.name)
        ) {
          emptyAttrs++;
        }
      });
    });
    if (emptyAttrs > 0) {
      result.warnings.push(`Found ${emptyAttrs} empty attribute(s)`);
    }

    // 6. Nested SVGs without proper namespace
    const nestedSVGs = svgElement.querySelectorAll("svg");
    nestedSVGs.forEach((nested) => {
      if (!nested.hasAttribute("xmlns")) {
        result.warnings.push("Nested SVG without xmlns attribute");
      }
    });

    // 7. Check for very large file size (potential performance issue)
    if (text.length > 500000) {
      // 500KB
      result.warnings.push(
        `Large file size (${Math.round(text.length / 1024)}KB) may cause performance issues`,
      );
    }

    // 8. Check for use of deprecated xlink:href
    const xlinkElements = svgElement.querySelectorAll("[*|href]");
    if (xlinkElements.length > 0) {
      result.warnings.push(
        "Uses deprecated xlink:href (will be converted to href)",
      );
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(
      `Failed to load or parse SVG: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  return result;
}

/**
 * Batch validate all SVGs in a category
 */
export async function validateSVGCategory(
  category: string,
  svgFiles: string[],
): Promise<Map<string, SVGValidationResult>> {
  const results = new Map<string, SVGValidationResult>();

  const promises = svgFiles.map(async (file) => {
    const path = `/assets/svg/${category}/${file}`;
    const result = await validateSVG(path);
    results.set(file, result);
  });

  await Promise.all(promises);
  return results;
}

/**
 * Validate all assets from the manifest
 */
export async function validateAllAssets(): Promise<{
  total: number;
  valid: number;
  withWarnings: number;
  invalid: number;
  results: Map<string, SVGValidationResult>;
}> {
  const results = new Map<string, SVGValidationResult>();
  let valid = 0;
  let withWarnings = 0;
  let invalid = 0;

  try {
    const response = await fetch("/assets/assets-manifest.json");
    const manifest = (await response.json()) as Record<
      string,
      Array<{ file: string }>
    >;

    for (const [category, assets] of Object.entries(manifest)) {
      if (!Array.isArray(assets) || assets.length === 0) continue;

      for (const asset of assets) {
        const path = `/assets/svg/${category.toLowerCase()}/${asset.file}`;
        const result = await validateSVG(path);
        results.set(path, result);

        if (!result.isValid) {
          invalid++;
        } else if (result.warnings.length > 0) {
          withWarnings++;
        } else {
          valid++;
        }
      }
    }
  } catch (error) {
    console.error("Failed to validate assets:", error);
  }

  return {
    total: results.size,
    valid,
    withWarnings,
    invalid,
    results,
  };
}

/**
 * Generate a validation report
 */
export function generateValidationReport(
  results: Map<string, SVGValidationResult>,
): string {
  let report = "# SVG Validation Report\n\n";

  const invalid = Array.from(results.entries()).filter(([, r]) => !r.isValid);
  const withWarnings = Array.from(results.entries()).filter(
    ([, r]) => r.isValid && r.warnings.length > 0,
  );
  const valid = Array.from(results.entries()).filter(
    ([, r]) => r.isValid && r.warnings.length === 0,
  );

  report += `## Summary\n`;
  report += `- ✅ Valid: ${valid.length}\n`;
  report += `- ⚠️  With Warnings: ${withWarnings.length}\n`;
  report += `- ❌ Invalid: ${invalid.length}\n`;
  report += `- **Total**: ${results.size}\n\n`;

  if (invalid.length > 0) {
    report += `## ❌ Invalid SVGs (${invalid.length})\n\n`;
    invalid.forEach(([path, result]) => {
      report += `### ${path}\n`;
      result.errors.forEach((error) => {
        report += `- ❌ ${error}\n`;
      });
      report += "\n";
    });
  }

  if (withWarnings.length > 0) {
    report += `## ⚠️  SVGs with Warnings (${withWarnings.length})\n\n`;
    withWarnings.forEach(([path, result]) => {
      report += `### ${path}\n`;
      result.warnings.forEach((warning) => {
        report += `- ⚠️  ${warning}\n`;
      });
      report += "\n";
    });
  }

  return report;
}

/**
 * Console logger for validation results
 */
export function logValidationResults(
  results: Map<string, SVGValidationResult>,
): void {
  console.group("🔍 SVG Validation Results");

  const invalid = Array.from(results.entries()).filter(([, r]) => !r.isValid);
  const withWarnings = Array.from(results.entries()).filter(
    ([, r]) => r.isValid && r.warnings.length > 0,
  );
  const valid = results.size - invalid.length - withWarnings.length;

  console.log(`✅ Valid: ${valid}`);
  console.log(`⚠️  With Warnings: ${withWarnings.length}`);
  console.log(`❌ Invalid: ${invalid.length}`);

  if (invalid.length > 0) {
    console.group("❌ Invalid SVGs");
    invalid.forEach(([path, result]) => {
      console.group(path);
      result.errors.forEach((error) => console.error(error));
      console.groupEnd();
    });
    console.groupEnd();
  }

  if (withWarnings.length > 0 && withWarnings.length <= 10) {
    console.group("⚠️  Warnings");
    withWarnings.forEach(([path, result]) => {
      console.group(path);
      result.warnings.forEach((warning) => console.warn(warning));
      console.groupEnd();
    });
    console.groupEnd();
  }

  console.groupEnd();
}
