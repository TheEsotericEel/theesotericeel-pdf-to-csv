// src/components/TablePreview.js
export default class TablePreview {
  /**
   * @param {Object}  opts
   * @param {Array[]} opts.data     – array of rows, each row is an array of cell-strings
   * @param {string[]} opts.headers – array of header titles (matches data[i].length)
   */
  constructor({ data = [], headers = [] } = {}) {
    this.data    = data;
    this.headers = headers;

    // root container
    this.container = document.createElement('div');
    this.container.className = 'overflow-x-auto mt-4';
  }

  /** so index.js can do tablePreview.getElement() */
  getElement() {
    return this.container;
  }

  /**
   * Update both data & headers, then re-render
   * @param {Array[]} newData
   * @param {string[]} newHeaders
   */
  setData(newData, newHeaders) {
    this.data    = newData  || [];
    this.headers = newHeaders || [];
    this.render();
  }

  render() {
    // clear old DOM
    this.container.innerHTML = '';

    // nothing to show
    if (!this.data.length || !this.headers.length) return;

    // build table
    const table = document.createElement('table');
    table.className = 'table-auto w-full border-collapse border border-gray-300';

    // header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    this.headers.forEach(text => {
      const th = document.createElement('th');
      th.className = 'border border-gray-300 px-4 py-2 bg-gray-100';
      th.innerText   = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // data rows
    const tbody = document.createElement('tbody');
    this.data.forEach(row => {
      const tr = document.createElement('tr');
      // assume row is an array, same length/order as headers
      this.headers.forEach((_, colIndex) => {
        const td = document.createElement('td');
        td.className = 'border border-gray-300 px-4 py-2 text-sm';
        td.innerText = row[colIndex] ?? '';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // attach to DOM
    this.container.appendChild(table);
  }
}
