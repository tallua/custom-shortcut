
import * as vscode from 'vscode';

import { ShortcutItem } from '../shortcut_provider';
import { SqliteSchema } from '../common/sqlite_schema'

export class SqliteShortcut extends ShortcutItem {
    public readonly label : string | undefined;
    public readonly command : vscode.Command;

    constructor(provider : string, public readonly sqlite : SqliteSchema) {
        super(provider);
        console.debug('SqliteShortcut : creating : ' + sqlite.title);
        this.label = sqlite.title;

        const url = sqlite.url;
        this.command = {
            command: 'custom-shortcut.open-link',
            title: '',
            arguments: [url]
        };
    }
}
