/**
 * Slug Generation Utility
 * 
 * Converts strings into URL-friendly slugs
 * Requirements: 1.1, 4.1
 */

/**
 * Generate a URL-friendly slug from a string
 * 
 * @param text - The text to convert to a slug
 * @returns A lowercase, hyphenated slug
 * 
 * @example
 * generateSlug("Web Developer") // "web-developer"
 * generateSlug("Data Analyst & ML Engineer") // "data-analyst-ml-engineer"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/--+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}
