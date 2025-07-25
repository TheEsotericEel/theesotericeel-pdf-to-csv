// Entry point for the PDF to CSV tool.
// This script wires together the UI components and utility functions.

import PDFUploader from './components/PDFUploader.js';
import TablePreview from './components/TablePreview.js';
import HeaderPicker from './components/HeaderPicker.js';
import ExportOptions from './components/ExportOptions.js';
import { generateHeaders } from './utils/tableParseUtils.js';

// Root container
const app = document.getElementById('app');

// State
let currentTableData = [];
let currentHeaders = [];

// Instantiate components
const pdfUploader = new PDFUploader({
    onDataReady: (tableData) => {
        currentTableData = tableData;
        currentHeaders = generateHeaders(tableData);
        tablePreview.setData(tableData, currentHeaders);
        headerPicker.setColumns(currentHeaders);
    },
    onProgress: (progress) => {
        // Optionally show progress if you add a progress bar.
        const prog = document.getElementById('progress');
        if (prog) prog.value = progress;
    }
});

const tablePreview = new TablePreview({
    onCellEdit: (rowIdx, colIdx, newValue) => {
        currentTableData[rowIdx][colIdx] = newValue;
    }
});

const headerPicker = new HeaderPicker({
    onHeaderChange: (selectedIndices) => {
        const selectedHeaders = selectedIndices.map(i => currentHeaders[i]);
        tablePreview.setSelectedColumns(selectedIndices);
        exportOptions.setHeaders(selectedHeaders);
    }
});

const exportOptions = new ExportOptions({
    getTableData: () => currentTableData,
    getHeaders: () => headerPicker.getSelectedHeaders() // Optional, depending on your ExportOptions impl
});

// Build UI
app.innerHTML = ''; // Clear out container

app.appendChild(pdfUploader.dropzone); // PDF drag/drop UI
app.appendChild(headerPicker.getElement()); // Columns selection UI
app.appendChild(tablePreview.getElement()); // Editable table
app.appendChild(exportOptions.getElement()); // Export/download button

// Optionally, wire up more logic if your components expose additional events.
