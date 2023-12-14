import { ExtensionContext } from 'vscode';
import { BPMNEditorProvider } from './bpmnEditorProvider';

export function activate(context: ExtensionContext) {
	context.subscriptions.push(BPMNEditorProvider.register(context));
}