export default class ExportOptions {
  constructor({ getData, getSelectedColumns }) {
    this.getData = getData;
    this.getSelectedColumns = getSelectedColumns;
    this.container = document.createElement('div');
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    const button = document.createElement('button');
    button.innerText = 'Export CSV';
    button.className = 'bg-blue-500 text-white px-4 py-2 rounded';
    button.addEventListener('click', () => {
      const data = this.getData();
      const selected = this.getSelectedColumns();
      const filtered = data.map(row => selected.map(i => row[i]));
      const csv = Papa.unparse(filtered);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'output.csv';
      link.click();
      URL.revokeObjectURL(url);
    });
    this.container.appendChild(button);
  }

  getElement() {
    return this.container;
  }
}
