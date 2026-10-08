/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Converts Eastern Arabic numerals (٠-٩) and Persian numerals (۰-۹) to standard Western Arabic numerals (0-9).
 */
export function toEnglishDigits(str: string | number): string {
  if (str === undefined || str === null) return '';
  const numStr = String(str);
  return numStr
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776));
}

/**
 * Sanitizes an input string to contain only English digits and an optional single decimal dot.
 */
export function sanitizeNumericInput(val: string): string {
  const english = toEnglishDigits(val);
  // Keep only numbers and at most one decimal point
  let dotted = english.replace(/[^0-9.]/g, '');
  const parts = dotted.split('.');
  if (parts.length > 2) {
    dotted = parts[0] + '.' + parts.slice(1).join('');
  }
  return dotted;
}
