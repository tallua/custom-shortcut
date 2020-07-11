import * as vscode from 'vscode';

import { NullShortcut, ShortcutProvider } from './shortcut_provider';
import { ShortcutDirectory } from './folders/shortcut_directory';

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

	let openLinkCommand = vscode.commands.registerCommand('custom-shortcut.open-link', (url : string) => {
		console.log('custom-shortcut.open-link : opening : ' + url);

		const uri = vscode.Uri.parse(url);
		const ext_supported_schemes = ['http', 'https', 'mailto', 'vscode'];
		if(ext_supported_schemes.indexOf(uri.scheme) > -1) {
			console.debug('opening type : external');
			vscode.env.openExternal(uri);
		} else {
			console.debug('opening type : document');
			vscode.workspace.openTextDocument(url)
				.then(
					doc => { vscode.window.showTextDocument(doc); },
					err => { vscode.window.showErrorMessage(err); }
				);
		}
	});
	context.subscriptions.push(openLinkCommand);

	console.log('custom-shortcut registering tree data provider...');
	vscode.window.registerTreeDataProvider(
		'global-shortcuts',
		new ShortcutProvider(new ShortcutDirectory(require('os').homedir() + '/' + 'Downloads'))
	);
	vscode.window.registerTreeDataProvider(
		'local-shortcuts',
		new ShortcutProvider(new NullShortcut())
	);

	console.log('custom-shortcut is activated');
}

export function deactivate() {}
