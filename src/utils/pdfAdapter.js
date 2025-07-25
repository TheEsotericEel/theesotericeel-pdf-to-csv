import { loadPdf, isPdfTextBased, extractTextFromPdf, renderPagesToCanvases as renderAllPagesToCanvases } from './pdfUtils.js';

// Wrapper functions to provide aliases expected by the components

export async function loadPdfWrapper(file) {
  return await loadPdf(file);
}

export async function isTextPdf(pdf) {
  return await isPdfTextBased(pdf);
}

export async function extractText(pdf) {
  return await extractTextFromPdf(pdf);
}

// Get canvases for a specified page range (1-indexed). Uses renderAllPagesToCanvases under the hood.
export async function getPdfPageCanvases(pdf, startPage = 1, endPage = pdf.numPages, scale = 2.0) {
  const all = await renderAllPagesToCanvases(pdf, scale);
  const end = Math.min(endPage, all.length);
  return all.slice(startPage - 1, end);
}

// Re-export to maintain compatibility with original naming
export async function renderPagesToCanvases(pdf, scale = 2.0) {
  return await renderAllPagesToCanvases(pdf, scale);
}
