
import { CSSResult, css, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import { ExecutionPlatform, VanillaBpmnEditorComponent } from "../vanilla-bpmn-editor"

import CamundaModeler from "camunda-bpmn-js/lib/camunda-platform/Modeler";
import CamundaModelerStyle from "camunda-bpmn-js/dist/assets/camunda-platform-modeler.css";

@customElement("camunda7-bpmn-editor")
export class Camund7BpmnEditorComponent extends VanillaBpmnEditorComponent {
  static override executionPlatform: ExecutionPlatform = {
    name: "Camunda Platform",
    version: "7.19.0"
  }
  override _executionPlatform: ExecutionPlatform = Camund7BpmnEditorComponent.executionPlatform;

  override _createModeler() {
    return new CamundaModeler({
      container: this.renderRoot.querySelector("#canvas") as HTMLElement,
      propertiesPanel: {
        parent: this.renderRoot.querySelector("#properties") as HTMLElement  
      }
    });
  }

  static override _getModelerStyle() : CSSResult {
    return css`${unsafeCSS(CamundaModelerStyle)}`;
  }
}