import {  LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("flex-resizer")
export class FlexResizer extends LitElement {
  
  override render() {
    return html`<slot></slot>`;
  }

  override firstUpdated(): void {;
    const children = this.renderRoot.querySelector("slot")?.assignedElements();
    if(!children || this.children.length === 0)
      return;

    for (let i = 0; i < (children.length - 1); i++) {
      const resizer = document.createElement("div");
      resizer.className = "flex-resizer-handle";
      children[i].after(resizer);
    } 

    this.renderRoot.addEventListener("mousedown", this._onMouseDown);
  }

  private _onMouseDown = (mouseDown: Event) => {
    const resizer = mouseDown.target as HTMLElement;

    if(!resizer || !resizer.classList.contains("flex-resizer-handle"))
      return;
  
    mouseDown.preventDefault();
    (resizer.parentElement as HTMLElement).style.cursor = getComputedStyle(resizer).cursor;

    const prev = resizer.previousElementSibling as HTMLElement;
    const next = resizer.nextElementSibling as HTMLElement;

    if(!prev || !next)
      return;

    let prevSize = prev.offsetWidth;
    let nextSize = next.offsetWidth;
    const sumSize = prevSize + nextSize;
    const prevGrow = Number(getComputedStyle(prev).flexGrow);
    const nextGrow = Number(getComputedStyle(next).flexGrow);
    const sumGrow = prevGrow + nextGrow;
    let lastPos = (mouseDown as MouseEvent).pageX;

    const onMouseMove = function(mouseMove: Event) {
      let pos = (mouseMove as MouseEvent).pageX;
      const d = pos - lastPos;
      prevSize += d;
      nextSize -= d;
      if (prevSize < 0) {
          nextSize += prevSize;
          pos -= prevSize;
          prevSize = 0;
      }
      if (nextSize < 0) {
          prevSize += nextSize;
          pos += nextSize;
          nextSize = 0;
      }

      const prevGrowNew = sumGrow * (prevSize / sumSize);
      const nextGrowNew = sumGrow * (nextSize / sumSize);

      prev.style.flexGrow = prevGrowNew.toString();
      next.style.flexGrow = nextGrowNew.toString();

      lastPos = pos;
    }

    const onMouseUp = () => {
        (resizer.parentElement as HTMLElement).style.removeProperty("cursor");
        
        this.renderRoot.removeEventListener("mousemove", onMouseMove);
        this.renderRoot.removeEventListener("mouseup", onMouseUp);
    };

    this.renderRoot.addEventListener("mousemove", onMouseMove);
    this.renderRoot.addEventListener("mouseup", onMouseUp);
  }

  static override get styles() {
    return [css`
      ::slotted(.flex-resizer-handle) {
        flex: 0 0 10px;
        background-color: lightgray;
        cursor: ew-resize;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="30"><path d="M2 0 v30 M5 0 v30 M8 0 v30" fill="none" stroke="black"/></svg>');
      }
    `];
  }

  override disconnectedCallback() : void {
    super.disconnectedCallback();
    this.renderRoot.removeEventListener("mousedown", this._onMouseDown);
  }
}