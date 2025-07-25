import { generateHeaders } from '../utils/tableParseUtils.js';

export default class HeaderPicker {
  constructor({ columns, onSelectionChange }) {
    this.columns = columns || [];
    this.onSelectionChange = onSelectionChange;
    this.selected = this.columns.map(() => true);
    this.container = document.createElement('div');
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.columns.forEach((header, index) => {
      const label = document.createElement('label');
      label.className = 'inline-flex items-center mr-4';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = this.selected[index];
      checkbox.className = 'mr-1';
      checkbox.addEventListener('change', () => {
        this.selected[index] = checkbox.checked;
        if (this.onSelectionChange) {
          this.onSelectionChange(this.getSelectedIndices());
        }
      });
      const span = document.createElement('span');
      span.innerText = header || `Column ${index + 1}`;
      label.appendChild(checkbox);
      label.appendChild(span);
      this.container.appendChild(label);
    });
  }

  getElement() {
    return this.container;
  }

  getSelectedIndices() {
    const indices = [];
    this.selected.forEach((checked, i) => {
      if (checked) indices.push(i);
    });
    return indices;
  }

  setColumns(columns) {
    this.columns = columns;
    this.selected = columns.map(() => true);
    this.render();
  }
}
