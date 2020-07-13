import * as vscode from 'vscode';

import { ShortcutProvider } from './shortcut_provider';
import { RootDirectory } from './folders/root_directory';

function registerCommands(context : vscode.ExtensionContext) {
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
}

function registerGlobalTreeview(config : vscode.WorkspaceConfiguration) {

	const pathList : string[] | undefined = config.get('globalDirectories');
	let refinedPath : string[] = [];

	if(pathList !== undefined) {
		refinedPath = pathList.map(path => {
			if(path.startsWith('~')) {
				return require('os').homedir() + path.substring(1);
			}
			return path;
		});
	}

	vscode.window.registerTreeDataProvider(
		'global-shortcuts',
		new ShortcutProvider(new RootDirectory(refinedPath))
	);
}

function registerLocalTreeview(config : vscode.WorkspaceConfiguration) {

	const path : string | undefined = config.get('globalDirectories');
	let refinedPath : string[] = [];

	if(path !== undefined) {
		refinedPath = [path];
	}

	vscode.window.registerTreeDataProvider(
		'local-shortcuts',
		new ShortcutProvider(new RootDirectory(refinedPath))
	);
}


export function activate(context: vscode.ExtensionContext) {

	console.log('custom-shortcut is activating...');
	const config = vscode.workspace.getConfiguration('custom-shortcut');

	console.log('custom-shortcut registering commands...');
	registerCommands(context);

	console.log('custom-shortcut registering tree data provider...');
	registerGlobalTreeview(config);
	registerLocalTreeview(config);

	console.log('custom-shortcut is activated');
}

export function deactivate() {}
