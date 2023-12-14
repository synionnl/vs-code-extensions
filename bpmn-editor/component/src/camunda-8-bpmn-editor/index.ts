import { CSSResult, css, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import { ExecutionPlatform, VanillaBpmnEditorComponent } from "../vanilla-bpmn-editor";

import CamundaModeler from "camunda-bpmn-js/lib/camunda-cloud/Modeler";
import CamundaModelerStyle from "camunda-bpmn-js/dist/assets/camunda-cloud-modeler.css";

@customElement("camunda8-bpmn-editor")
export class Camunda8BpmnEditorComponent extends VanillaBpmnEditorComponent {
  static override executionPlatform: ExecutionPlatform = {
    name: "Camunda Cloud",
    version: "8.2.0"
  }
  override _executionPlatform: ExecutionPlatform = Camunda8BpmnEditorComponent.executionPlatform;

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