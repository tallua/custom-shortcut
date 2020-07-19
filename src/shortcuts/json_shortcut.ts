
import * as vscode from 'vscode';

import { ShortcutItem } from '../shortcut_provider';
import { JsonDirectoryScehma } from '../common/json_schema'

export class JsonShortcut extends ShortcutItem {
    public readonly label : string | undefined;
    public readonly command : vscode.Command;

    constructor(provider : string, public readonly json : JsonDirectoryScehma) {
        super(provider);
        console.debug('JsonShortcut : creating : ' + json.name);
        this.label = json.name;

        const url = json.url;
        this.command = {
            command: 'custom-shortcut.open-link',
            title: '',
            arguments: [url]
        };
    }
}
