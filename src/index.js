// Entry point for the PDF to CSV tool.
// This script wires together the UI components and utility functions.

import { PDFUploader } from './components/PDFUploader.js';
import { TablePreview } from './components/TablePreview.js';
import { HeaderPicker } from './components/HeaderPicker.js';
import { ExportOptions } from './components/ExportOptions.js';

// Root container defined in index.html
const app = document.getElementById('app');
const progressEl = document.getElementById('progress');

// Application state
let tableData = [];
let selectedColumns = [];

// Update progress message in the UI
function updateProgress(message) {
  progressEl.textContent = message;
}

// Called whenever new table data is ready
function updateTable(newData) {
  tableData = newData;
  // Update preview and header picker
  tablePreview.update(tableData);
  headerPicker.update(tableData[0] || []);
}

// Called when the user changes which columns to export
function updateSelectedColumns(cols) {
  selectedColumns = cols;
}

// Instantiate UI components
const pdfUploader = PDFUploader({ onTableReady: updateTable, onProgress: updateProgress });
const headerPicker = HeaderPicker({ columns: [], onSelectionChange: updateSelectedColumns });
const tablePreview = TablePreview({ data: tableData, onDataChange: updateTable });
const exportOptions = ExportOptions({ getData: () => tableData, getSelectedColumns: () => selectedColumns });

// Append components to the DOM
app.appendChild(pdfUploader.element);
app.appendChild(headerPicker.element);
app.appendChild(tablePreview.element);
app.appendChild(exportOptions.element);
