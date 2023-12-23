import { html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import "../vanilla-bpmn-editor";
import "../camunda-7-bpmn-editor";
import "../camunda-8-bpmn-editor";
import { VanillaBpmnEditorComponent } from "../vanilla-bpmn-editor";
import { Camund7BpmnEditorComponent as Camunda7BpmnEditorComponent } from "../camunda-7-bpmn-editor";
import { Camunda8BpmnEditorComponent } from "../camunda-8-bpmn-editor";

@customElement("bpmn-editor")
export class BPMNEditorComponent extends LitElement {
  private _xml!: string

  @query('#editor')
  _editor!: VanillaBpmnEditorComponent;

  @state()
  private _platform!: string | null;

  @property({ attribute: "data-xml" })
  set xml(xml: string) {
    this._xml = xml;
    this._platform = this._determinePlatform();
  }

  get xml() {
    return this._xml;
  }

  override render() {
    if (!this._platform) {
      return html`
        <ul>
          ${
            [VanillaBpmnEditorComponent.executionPlatform, Camunda7BpmnEditorComponent.executionPlatform, Camunda8BpmnEditorComponent.executionPlatform]
              .map(ep => html`<li class=${ep.name}><a @click=${this._onClick} data-platform=${ep.name}>${ep.name} (${ep.version})</a></li>`)
          }
        </ul>
      `;
    }
    else {
      switch (this._platform) {
        case VanillaBpmnEditorComponent.executionPlatform.name:
          return html`<vanilla-bpmn-editor id="editor" @changed=${this._onChanged} data-xml=${this.xml}></vanilla-bpmn-editor>`;
        case Camunda7BpmnEditorComponent.executionPlatform.name:
          return html`<camunda7-bpmn-editor id="editor" @changed=${this._onChanged} data-xml=${this.xml}></camunda7-bpmn-editor>`;
        case Camunda8BpmnEditorComponent.executionPlatform.name:
          return html`<camunda8-bpmn-editor id="editor" @changed=${this._onChanged} data-xml=${this.xml}></camunda8-bpmn-editor>`;
        default:
          return html`<p>${this._platform} is not a known execution platform.</p>`;
      }
    }
  }

  public toggleProperties() {
    this._editor.toggleProperties();
  }

  private _determinePlatform(): string | null {
    if (!this._xml)
      return null;

    const match = /modeler:executionPlatform=\"([^\"]+)\"/gm.exec(this.xml);
    if (match) {
      return match[1];
    }

    return VanillaBpmnEditorComponent.executionPlatform.name;
  }

  private _onClick(e: Event) {
    this._platform = (e.target as HTMLElement).attributes.getNamedItem("data-platform")?.value as string;
  }

  private _onChanged(e: CustomEvent<XmlChanged>) {
    this.dispatchEvent(new CustomEvent<XmlChanged>("changed", { detail: e.detail}));
  }
}

export interface XmlChanged {
  xml: string
}