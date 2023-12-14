import "../../component/dist/bpmn-editor";
const vscode = acquireVsCodeApi();

window.addEventListener("load", onLoad);
window.addEventListener("message", onMessage);

function onLoad() {
  const editor = document.getElementById("bpmn-editor") as HTMLElement;
  editor.addEventListener("changed", onEditorChanged);
}

function onMessage(e: any) {
  if (!e.isTrusted || e.type !== "message") { return; }

  switch (e.data?.type) {
    case "documentUpdated":
      onDocumentUpdated(e.data.text as string);
      break;
    default:
      console.log(e);
  }
}

function onDocumentUpdated(xml: string) {
  (document.getElementById("bpmn-editor") as any).xml = xml;
}

function onEditorChanged(e: any) {
  vscode.postMessage({
    type: "xmlChanged",
    xml: e.detail.xml
  });
} 