import { window, Disposable, CustomTextEditorProvider, ExtensionContext, TextDocument, WebviewPanel, CancellationToken, commands, ViewColumn } from 'vscode';
import { BPMNEditorPanel } from './bpmnEditorPanel';

export class BPMNEditorProvider implements CustomTextEditorProvider {
  private static readonly viewType = "biz-dev-ops.bpmn-editor";
  private _document?: TextDocument;

  public static register(context: ExtensionContext): Disposable {
    const provider = new BPMNEditorProvider(context);
    return window.registerCustomEditorProvider(
      BPMNEditorProvider.viewType, 
      provider
    );
  }

  constructor(private readonly context: ExtensionContext) { 
    context.subscriptions.push(commands.registerCommand("biz-dev-ops.bpmn-editor-show-xml", this._onShowXml.bind(this)));
  }

  async resolveCustomTextEditor(document: TextDocument, webviewPanel: WebviewPanel, token: CancellationToken): Promise<void> {
    BPMNEditorPanel.render(webviewPanel, document, this.context.extensionUri);
    this._document = document;
  }
  
  private async _onShowXml(): Promise<void> { 
    if(!this._document) {
      return;
    }

    await window.showTextDocument(this._document, {
      preserveFocus: false,
      preview: false,
      viewColumn: ViewColumn.Active
    });
  }
}
