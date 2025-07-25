console.log("ExportOptions loaded!");
export default class ExportOptions {
  constructor() {
    this.container = document.createElement('div');
    this.container.textContent = "ExportOptions is mounted!";
  }
  getElement() {
    return this.container;
  }
}
