import { html, css, LitElement, unsafeCSS, CSSResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import BaseModeler from "camunda-bpmn-js/lib/base/Modeler";
import ModelerStyle from "camunda-bpmn-js/dist/assets/base-modeler.css";
import { XmlChanged } from "../bpmn-editor";

import "../flex-resizer";

@customElement("vanilla-bpmn-editor")
export class VanillaBpmnEditorComponent extends LitElement {
  private _modeler!: BaseModeler;

  private _xml!: string;

  static executionPlatform: ExecutionPlatform = {
    name: "BPMN",
    version: "2.0"
  }

  protected _executionPlatform: ExecutionPlatform = VanillaBpmnEditorComponent.executionPlatform;

  @query("#container")
  _container!: HTMLElement

  @query(".flex-resizer-handle")
  _flexResizerHandle!: HTMLElement

  @property({ attribute: "data-xml" })
  set xml(xml: string) {
    this._xml = xml;
  }

  get xml() { return this._xml; }

  constructor() {
    super();
    this._onCommandStackChanged = this._onCommandStackChanged.bind(this);
    this._onHandleClick = this._onHandleClick.bind(this);
  }

  override render() {
    return html`
      <flex-resizer id="container">
        <div id="canvas" tabindex="0"></div>
        <div id="properties" tabindex="1">
          <button id="close" @click="${this.toggleProperties}">x</button>
        </div>
      </flex-resizer>
    `;
  }

  override async firstUpdated() {
    this._modeler = this._createModeler();
    (this._modeler.get("keyboard") as any).bind(this.renderRoot.querySelector("#canvas"));
    this._modeler.on("commandStack.changed", this._onCommandStackChanged);

    if (!this.xml) {
      await this._modeler.createDiagram();

      const canvas = this._modeler.get("canvas") as any;
      const modeling = this._modeler.get("modeling") as any;
      const definitions = this._modeler.getDefinitions();

      modeling.updateModdleProperties(canvas.getRootElement(), definitions, {
        "xmlns:modeler": "http://camunda.org/schema/modeler/1.0",
        "modeler:executionPlatform": this._executionPlatform.name,
        "modeler:executionPlatformVersion": this._executionPlatform.version
      });
    }
    else {
      await this._modeler.importXML(this.xml);
    }

    (this._modeler.get("canvas") as any).zoom("fit-viewport");

    this._flexResizerHandle.addEventListener("click", this._onHandleClick);
  }

  public toggleProperties() {
    this._container!.classList.toggle("hide-properties");
  }

  private _onHandleClick(e: any) {
    e.preventDefault();
    if (!this._container.classList.contains("hide-properties")) {
      return;
    }

    this.toggleProperties();
  }

  protected _createModeler(): BaseModeler {
    return new BaseModeler({
      container: this.renderRoot.querySelector("#canvas") as HTMLElement,
      propertiesPanel: {
        parent: this.renderRoot.querySelector("#properties") as HTMLElement
      }
    });
  }

  protected static _getModelerStyle(): CSSResult {
    return css`${unsafeCSS(ModelerStyle)}`;
  }

  private async _onCommandStackChanged() {
    const result = await this._modeler.saveXML();
    this.dispatchEvent(new CustomEvent<XmlChanged>("changed", { detail: { xml: result.xml as string } }));
  }

  static override get styles() {
    return [this._getModelerStyle(), css`
      #container {
        height: 100%;
        display: flex;
        flex-direction: row;
        overflow: hidden;
      }

      #canvas {
        height: 100%;
        flex: 3;
      }

      #properties {
        height: 100%;
        flex: 1;
        position: relative;
      }

      #close {
        position: absolute;
        right: 0;
        z-index:99999;
      }

      #container.hide-properties #properties {
        display: none;
      }

      #container.hide-properties .flex-resizer-handle {
        cursor: pointer !important;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="30"><path d="M2 0 v30 M5 0 v30 M8 0 v30" fill="none" stroke="black"/></svg>');
      }
      `];
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    (this._modeler.get("keyboard") as any).unbind();
    this._modeler.off("commandStack.changed", this._onCommandStackChanged);
    this._flexResizerHandle.removeEventListener("click", this._onHandleClick);
  }
}

export type ExecutionPlatform = {
  name: string
  version: string
}