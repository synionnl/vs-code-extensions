import { html, css, LitElement, unsafeCSS, CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";

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
  
  @property({ attribute: "data-xml" })
  set xml(xml: string) {
    this._xml = xml;
  }

  get xml() { return this._xml; }

  constructor() {
    super();
    this._onCommandStackChanged = this._onCommandStackChanged.bind(this);
  }

  override render() {
    return html`
      <flex-resizer class="container">
        <div id="canvas" tabindex="0"></div>
        <div id="properties" tabindex="1"></div>
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
      .container {
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
      }
      `];
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    (this._modeler.get("keyboard") as any).unbind();
    this._modeler.off("commandStack.changed", this._onCommandStackChanged);
  }
}

export type ExecutionPlatform = {
  name: string
  version: string
}