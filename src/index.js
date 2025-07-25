// Entry point for the PDF to CSV tool.
import PDFUploader from './components/PDFUploader.js';
import TablePreview from './components/TablePreview.js';
import HeaderPicker from './components/HeaderPicker.js';
import ExportOptions from './components/ExportOptions.js';
import { generateHeaders } from './utils/tableParseUtils.js';

// Root container
const app = document.getElementById('app');

// App State
let currentTableData = [];
let currentHeaders = [];

// Instantiate display components first (order matters!)
const tablePreview = new TablePreview();
const headerPicker = new HeaderPicker();
const exportOptions = new ExportOptions();

// PDFUploader is created last, after all dependencies exist
const pdfUploader = new PDFUploader({
  onDataReady: (tableData) => {
    console.log("Extracted table data:", tableData);

    currentTableData = tableData;
    currentHeaders = generateHeaders(tableData);

    tablePreview.setData(tableData, currentHeaders);
    headerPicker.setColumns(currentHeaders);
  },
  onProgress: ({ progress }) => {
    const prog = document.getElementById('progress');
    if (prog) prog.innerText = `${Math.round(progress * 100)}%`;
  }
});
