// src/index.js
import PDFUploader from './components/PDFUploader.js';
import TablePreview from './components/TablePreview.js';
import HeaderPicker from './components/HeaderPicker.js';
import ExportOptions from './components/ExportOptions.js';
import { generateHeaders } from './utils/tableParseUtils.js';

// Mount point
const app = document.getElementById('app');

// App state
let currentTableData = [];
let currentHeaders   = [];

// Instantiate UI components
const tablePreview = new TablePreview({
  data: [],
  onDataChange: (data) => {
    currentTableData = data;
  }
});

const headerPicker = new HeaderPicker({
  columns: [],
  onSelectionChange: (selectedIndices) => {
    currentHeaders = selectedIndices;
  }
});

const exportOptions = new ExportOptions({
  getData:    () => currentTableData,
  getColumns: () => currentHeaders
});

// Clear any placeholder markup
app.innerHTML = '';

// Mount each component into the single #app container
app.appendChild(tablePreview.getElement());
app.appendChild(headerPicker.getElement());
app.appendChild(exportOptions.getElement());

// Finally, wire up the PDF uploader
new PDFUploader({
  onDataReady: (tableData) => {
    console.log('📊 Parsed data:', tableData);

    // push into our state
    currentTableData = tableData;
    currentHeaders   = generateHeaders(tableData);

    // refresh UI
    tablePreview.setData(tableData);
    headerPicker.setColumns(currentHeaders);
  },
  onProgress: ({ progress }) => {
    const prog = document.getElementById('progress');
    if (prog) prog.innerText = `${Math.round(progress * 100)}%`;
  }
});
