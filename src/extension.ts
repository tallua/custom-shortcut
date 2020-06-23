import * as vscode from 'vscode';

import { NullShortcut, ShortcutProvider } from './shortcut_provider';

export function activate(context: vscode.ExtensionContext) {

	console.log('custom-shortcut is activating...');

	console.log('custom-shortcut registering commands...');
	let refreshCommand = vscode.commands.registerCommand('custom-shortcut.refresh', () => {
		vscode.window.showInformationMessage('Custom Shortcut : Refresh');
	});
	context.subscriptions.push(refreshCommand);

	let configCommand = vscode.commands.registerCommand('custom-shortcut.open-config', () => {
		vscode.window.showInformationMessage('Custom Shortcut : Open  Config');
	});
	context.subscriptions.push(configCommand);

	console.log('custom-shortcut registering tree data provider...');
	vscode.window.registerTreeDataProvider(
		'global-shortcuts',
		new ShortcutProvider(new NullShortcut())
	);
	vscode.window.registerTreeDataProvider(
		'local-shortcuts',
		new ShortcutProvider(new NullShortcut())
	);

	console.log('custom-shortcut is activated');
}

export function deactivate() {}
