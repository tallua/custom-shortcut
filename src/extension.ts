import * as vscode from 'vscode';

import { Shortcut, ShortcutProvider } from './shortcut_provider';
import { RootDirectory } from './folders/root_directory';

let providerList : ShortcutProvider[] = [];

function registerCommands(context : vscode.ExtensionContext) {
	let refreshCommand = vscode.commands.registerCommand('custom-shortcut.refresh-all', () => {
		vscode.window.showInformationMessage('Custom Shortcut : Refresh All');

		providerList.forEach(provider => provider.refresh(undefined));
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

	
	let refreshNodeCommand = vscode.commands.registerCommand('custom-shortcut.refresh', 
	(provider : ShortcutProvider, node : Shortcut) => {
		vscode.window.showInformationMessage('Custom Shortcut : Refresh');

		provider.refresh(node);
	});
	context.subscriptions.push(refreshNodeCommand);
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

	const globalProvider = new ShortcutProvider(new RootDirectory(refinedPath));
	providerList.push(globalProvider);
	let tmp = vscode.window.createTreeView('global-shortcuts', { treeDataProvider : globalProvider });
	
}

function registerLocalTreeview(config : vscode.WorkspaceConfiguration) {

	const path : string | undefined = config.get('localDirectories');
	let refinedPath : string[] = [];

	if(path !== undefined) {
		refinedPath = [path];
	}

	
	const localProvider = new ShortcutProvider(new RootDirectory(refinedPath));
	providerList.push(localProvider);
	vscode.window.createTreeView('local-shortcuts', { treeDataProvider : localProvider });
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
