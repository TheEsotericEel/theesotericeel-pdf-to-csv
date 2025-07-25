/*
 * Utility functions for loading and inspecting PDF documents using pdf.js.
 *
 * All functions in this module rely on the globally available `pdfjsLib` object
 * which is provided by the pdf.js script included in index.html. These helpers
 * wrap common tasks such as loading a document, checking if it is text‑based
 * and rendering pages to canvases for OCR.
 */

// Load a PDF document from a File object. Returns a resolved pdfjsLib document.
export async function loadPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  return pdf;
}

// Determine if a PDF is primarily text based by inspecting the first page.
// Returns true if the first page contains more than a few characters of text.
export async function isPdfTextBased(pdf) {
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  let length = 0;
  textContent.items.forEach((item) => {
    if (item.str && item.str.trim()) {
      length += item.str.trim().length;
    }
  });
  return length > 10;
}

// Extract all textual content from a PDF by concatenating the text from each page.
// Returns a single string with newlines separating pages.
export async function extractTextFromPdf(pdf) {
  const numPages = pdf.numPages;
  let combinedText = '';
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const textItems = textContent.items.map((item) => item.str);
    combinedText += textItems.join(' ') + '\n';
  }
  return combinedText;
}

// Render each page of a PDF to a canvas element. A scale factor is applied
// to produce a higher resolution image for OCR accuracy. Returns an array
// of canvases. The canvases are not attached to the DOM.
export async function renderPagesToCanvases(pdf, scale = 2.0) {
  const canvases = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    canvases.push(canvas);
  }
  return canvases;
}
