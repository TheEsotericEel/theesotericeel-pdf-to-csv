import { isTextPdf, extractText, getPdfPageCanvases } from '../utils/pdfUtils.js';
import { ocrCanvases } from '../utils/ocrUtils.js';
import { parseTextToTable } from '../utils/tableParseUtils.js';

export default class PDFUploader {
  constructor({ onDataReady, onProgress }) {
    this.onDataReady = onDataReady;
    this.onProgress = onProgress;
    this.handleFiles = this.handleFiles.bind(this);
    this.createDropZone();
  }

  createDropZone() {
    this.dropzone = document.createElement('div');
    this.dropzone.id = 'dropzone';
    this.dropzone.className = 'border-2 border-dashed border-gray-400 rounded p-4 text-center';
    this.dropzone.innerText = 'Drag and drop PDF files here or click to select';
    this.dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropzone.classList.add('bg-gray-100');
    });
    this.dropzone.addEventListener('dragleave', () => {
      this.dropzone.classList.remove('bg-gray-100');
    });
    this.dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropzone.classList.remove('bg-gray-100');
      this.handleFiles(e.dataTransfer.files);
    });
    this.dropzone.addEventListener('click', () => {
      this.fileInput.click();
    });

    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = '.pdf';
    this.fileInput.multiple = true;
    this.fileInput.className = 'hidden';
    this.fileInput.addEventListener('change', () => {
      this.handleFiles(this.fileInput.files);
    });

    const app = document.getElementById('app');
    app.appendChild(this.dropzone);
    app.appendChild(this.fileInput);
  }

  async handleFiles(fileList) {
    const files = Array.from(fileList);
    for (const file of files) {
      await this.processFile(file);
    }
  }

  async processFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const textPdf = await isTextPdf(pdf);

    if (textPdf) {
      const pagesText = await extractText(pdf);
      let allRows = [];
      for (const pageText of pagesText) {
        const table = parseTextToTable(pageText);
        allRows.push(...table);
      }
      this.onDataReady(allRows);
    } else {
      const canvases = await getPdfPageCanvases(pdf);
      const chunks = this.chunkCanvases(canvases);
      let allRows = [];
      let processedPages = 0;
      for (const chunk of chunks) {
        const ocrResults = await ocrCanvases(chunk, ({ progress }) => {
          if (this.onProgress) {
            this.onProgress({ progress: (processedPages + progress) / canvases.length });
          }
        });
        for (const text of ocrResults) {
          const table = parseTextToTable(text);
          allRows.push(...table);
        }
        processedPages += chunk.length;
      }
      this.onDataReady(allRows);
    }
  }

  chunkCanvases(canvases) {
    const deviceMemory = navigator.deviceMemory || 4;
    const maxPerChunk = Math.max(1, Math.floor(deviceMemory));
    const chunks = [];
    for (let i = 0; i < canvases.length; i += maxPerChunk) {
      chunks.push(canvases.slice(i, i + maxPerChunk));
    }
    return chunks;
  }
}
