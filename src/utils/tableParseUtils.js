/*
 * Simple utilities for parsing plain text into table‑like structures and
 * generating header information. Bank statements vary widely in format, so
 * these heuristics are deliberately generic. Users can refine the output
 * via manual correction before exporting.
 */

// Convert raw text into a two‑dimensional array representing rows and columns.
// Lines are split on newlines, then on runs of whitespace or commas. Empty
// results are filtered out. The returned array may have rows of varying
// lengths depending on the source content.
export function parseTextToTable(text) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const rows = [];
  for (const line of lines) {
    // Split on sequences of two or more spaces, tabs or commas
    const cols = line
      .split(/\s{2,}|\t|,/)
      .map((c) => c.trim())
      .filter(Boolean);
    if (cols.length > 0) {
      rows.push(cols);
    }
  }
  return rows;
}

// Generate default headers for a table. If the first row appears to contain
// all numeric values or dates, we treat it as data rather than headers and
// produce generic column names (Column 1, Column 2, …). Otherwise the
// first row is used as the initial header list. The function ensures that
// headers are unique by appending an index when duplicates exist.
export function generateHeaders(rows) {
  if (!rows || rows.length === 0) return [];
  const firstRow = rows[0];
  // Simple heuristic: if every cell in the first row contains a digit,
  // treat it as data rather than a header row.
  const isDataRow = firstRow.every((cell) => /\d/.test(cell));
  let headers;
  if (isDataRow) {
    headers = firstRow.map((_, idx) => `Column ${idx + 1}`);
  } else {
    headers = [...firstRow];
  }
  // Ensure uniqueness of header names
  const seen = {};
  headers = headers.map((h) => {
    const base = h || 'Column';
    if (!seen[base]) {
      seen[base] = 1;
      return base;
    }
    seen[base] += 1;
    return `${base} ${seen[base]}`;
  });
  return headers;
}
