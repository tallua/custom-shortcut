import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('custom-shortcut is activating...');

	let refreshCommand = vscode.commands.registerCommand('custom-shortcut.refresh', () => {
		vscode.window.showInformationMessage('Custom Shortcut : Refresh');
	});
	context.subscriptions.push(refreshCommand);

	let configCommand = vscode.commands.registerCommand('custom-shortcut.open-config', () => {
		vscode.window.showInformationMessage('Custom Shortcut : Open  Config');
	});
	context.subscriptions.push(configCommand);

	console.log('custom-shortcut is activated');
}

export function deactivate() {}
