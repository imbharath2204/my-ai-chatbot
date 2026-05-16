import fs from 'fs/promises';
import path from 'path';

/**
 * Safely calculate math expressions extracted from agent responses
 * @param {string} expression - Raw expression from agent (e.g. "17 * 19")
 * @returns {Promise<string>} Result as string or error message
 */
export async function calc(expression) {
  try {
    // Clean the expression: remove invalid characters but keep math operators
    const cleanExpr = expression
      .trim()
      .replace(/[^0-9+\-*/().\s]/g, '')  // Remove letters, TOOL, etc.
      .replace(/\s+/g, ' ')               // Normalize spaces
      .trim();

    if (!cleanExpr || cleanExpr.length < 1) {
      return 'Invalid expression provided';
    }

    // Use strict mode and safe eval wrapper
    const result = Function(
      '"use strict"; return (' + cleanExpr + ');'
    )();

    // Validate result is a number
    if (typeof result !== 'number') {
      return `Invalid result type: ${typeof result}`;
    }

    return String(result);
  } catch (error) {
    return `Calc error: ${error.message}`;
  }
}

/**
 * Safely read the policy document
 * @returns {Promise<string>} Policy text or error message
 */
export async function searchPolicy() {
  try {
    const policyPath = path.join(process.cwd(), 'docs', 'policy.txt');
    const policy = await fs.readFile(policyPath, 'utf8');
    return policy.trim();
  } catch (error) {
    return `Policy file not found: ${error.message}`;
  }
}