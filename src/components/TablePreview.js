export default class TablePreview {
  constructor() {
    this.data = [];
    this.headers = [];

    this.container = document.createElement('div');
    this.container.id = 'table-preview';
    this.container.className = 'overflow-x-auto mt-4';

    const app = document.getElementById('app');
    app.appendChild(this.container);
  }

  setData(data, headers) {
    this.data = data;
    this.headers = headers;
    this.render();
  }

  render() {
    this.container.innerHTML = ''; // Clear previous contents

    // Safeguard against undefined data/headers
    if (!this.data || !this.headers) return;

    const table = document.createElement('table');
    table.className = 'table-auto w-full border-collapse border border-gray-300';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    this.headers.forEach(header => {
      const th = document.createElement('th');
      th.className = 'border border-gray-300 px-4 py-2 bg-gray-100';
      th.innerText = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    this.data.forEach(row => {
      const tr = document.createElement('tr');
      this.headers.forEach(header => {
        const td = document.createElement('td');
        td.className = 'border border-gray-300 px-4 py-2 text-sm';
        td.innerText = row[header] || '';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    this.container.appendChild(table);
  }
}
