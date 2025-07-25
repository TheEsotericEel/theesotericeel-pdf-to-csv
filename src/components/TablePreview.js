export default class TablePreview {
  constructor({ data, onDataChange }) {
    this.data = data;
    this.onDataChange = onDataChange;
    this.container = document.createElement('div');
    this.render();
  }

  render() {
    // Clear previous
    this.container.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'min-w-full divide-y divide-gray-200';
    this.data.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      row.forEach((cell, colIndex) => {
        const td = document.createElement('td');
        td.className = 'border px-2 py-1';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = cell;
        input.className = 'w-full';
        input.addEventListener('blur', () => {
          this.data[rowIndex][colIndex] = input.value;
          if (this.onDataChange) this.onDataChange(this.data);
        });
        td.appendChild(input);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    this.container.appendChild(table);
  }

  getElement() {
    return this.container;
  }

  setData(newData) {
    this.data = newData;
    this.render();
  }
}
